(async function () {
    let api = await chrome.storage.sync.get(["api"]);

    if (api && api.api) {
        let details_ob = {
            api_key: api.api,
            type: 'real_estate_listing',
            images: [],
            price: "",
            address: "",
            bedrooms: 0,
            baths: 0,
            sq_ft: 0,
            special: "",
            fact_features: {
                title: "",
                values: []
            },
            seller_phone_number: "",
            zillow_listing_url: ""
        };

        let check = setInterval(function () {
            let by_id = $("#search-detail-lightbox");
            let btn_container = $(".ds-data-view-list");
            if (btn_container && btn_container.length > 0) {
                $("#btn_scrape").remove();
                $(btn_container).prepend('<button id="btn_scrape" style="margin-top:30px;background:red;width:100%;color:white">Scrape Listing</button>');
                $("#btn_scrape").click(function () {
                    $(this).text("done");
                    console.log(details_ob);
                    chrome.runtime.sendMessage({ type: "save_agent", data: details_ob }, function (res) {
                        // chrome.storage.sync.set({ csv_url: res.csv_file}, function () {});
                        console.log(res);
                    });
                    clearInterval(check);
                    setTimeout(() => {
                        $("#btn_scrape").hide();
                    }, 2000)
                });
            }
            let owner_details = $("p");
            if (by_id && by_id.length > 0 && by_id.find("picture").length > 0 && by_id.find("picture").find("img")) {
                $(by_id.find("picture").find("img")).each(function (ind) {
                    let image_url = $(this).attr("src");
                    image_url = image_url.includes("cc_ft_960") ? image_url : image_url.split("cc_ft_")[0] + "cc_ft_960." + image_url.split(/[#?]/)[0].split('.').pop().trim();
                    if (details_ob.images.indexOf(image_url) <= -1) {
                        details_ob.images.push(image_url);
                    }
                })
                if (by_id && by_id.find("div").length > 0 && by_id.find("span").length > 0) {
                    by_id.find("span").each(function () {
                        if ($(this).attr("data-testid") === "price" && $(this).text().includes("$")) {
                            details_ob.price = $(this).text().replace(/\D/g, "");
                            $(this).parent().parent().parent().children().each(function (index) {
                                if (index === 1) {
                                    details_ob.address = $(this).text().replace(/,/g, '-');
                                }
                            })
                        }
                    })
                    by_id.find("div").each(function () {
                        if ($(this).attr("data-testid") === "price" && $(this).text().includes("$")) {
                            details_ob.price = $(this).text().replace(/\D/g, "");
                            $(this).parent().parent().parent().children().each(function (index) {
                                if (index === 1) {
                                    details_ob.address = $(this).text().replace(/,/g, '-');
                                }
                            })
                        }
                        else if ($(this).attr("data-testid") === "bed-bath-sqft-fact-container" && $(this).text().includes("beds")) {
                            details_ob.bedrooms = $(this).text().replace(/\D/g, "");
                        }
                        else if ($(this).attr("data-testid") === "bed-bath-sqft-fact-container" && $(this).text().includes("baths")) {
                            details_ob.baths = $(this).text().replace(/\D/g, "");
                        }
                        else if ($(this).attr("data-testid") === "bed-bath-sqft-fact-container" && $(this).text().includes("sqft")) {
                            details_ob.sq_ft = $(this).text().replace(/\D/g, "");
                        }

                    })
                }

                if (owner_details && owner_details.length > 0) {
                    owner_details.each(function () {
                        if ($(this).text().includes("Property Owner")) {
                            details_ob.seller_phone_number = $(this).text().split("Property Owner")[1];
                        }
                    });
                }
                details_ob.zillow_listing_url = $(location).attr('href');

                // clearInterval(check);
            }
            $(".ds-data-view-list").children().each(function () {

                if ($(this).find("h2").text().includes("What's special")) {
                    details_ob.special = $(this).find("article").text().replace("Show more", "");
                    details_ob.seller_phone_number = $($($(this).find("div[role='contentinfo']")[0]).find("p[data-testid='attribution-BROKER']").children().eq(1)).text();
                }
                else if ($(this).find("h2").text().includes("Facts & features")) {
                    details_ob.fact_features.title = $(this).find("h2").text();
                    let list = $(this).find("h2") && $(this).find("h2").length > 0 ? $(this).find("h2")[0] : null;
                    let list_parent = list ? $(list).parent().children() : [];

                    list_parent.each(function () {
                        let sub_title = $(this).find("h3");

                        sub_title ? sub_title.each(function () {
                            let feature_facts = { heading: "", values: [] };
                            feature_facts.heading = $(this).text();
                            let sub_list = $(this).parent().parent().find("h6");
                            sub_list ? sub_list.each(function () {
                                let subtitle_list = { subtitle: $(this).text(), values: [] };
                                let values = $(this).parent().find("li");
                                values ? values.each(function () {
                                    let elements = $(this).text().split(":");
                                    subtitle_list.values.push({ key: elements[0], value: elements[1].trim() });
                                }) : null;
                                feature_facts.values.push(subtitle_list);
                            }) : null;

                            let found_ob = details_ob.fact_features.values.find(e => e.heading === feature_facts.heading);
                            if (!found_ob || (found_ob && Object.keys(found_ob).length <= 0)) {
                                details_ob.fact_features.values.push(feature_facts);
                            }
                        }) : null;
                    })
                }

                else if ($(this).find("[data-testid='attribution-BROKER']")) {
                    console.log($($(this).find("[data-testid='attribution-BROKER']")[0]))
                }
            })
        }, 1000)
    }
    else {
        alert("Please set API Key");
    }
})();

