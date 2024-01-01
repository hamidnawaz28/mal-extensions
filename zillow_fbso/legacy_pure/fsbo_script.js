(async function () {

    let api = await chrome.storage.sync.get(["api"]);

    if (api && api.api) {
        let ob = { api_key: api.api, type: 'real_estate_listing', image: "", price: "", address: "", bedrooms: 0, baths: 0, sq_ft: 0, seller_phone_number: "", zillow_listing_url: "" };
        let check = setInterval(function () {
            let by_id = $("#search-detail-lightbox");

            let owner_details = $("p");
            if (by_id && by_id.length > 0 && by_id.find("picture").length > 0 && by_id.find("picture").find("img")) {
                $(by_id.find("picture").find("img")).each(function (ind) {
                    if (ind === 0) {
                        ob.image = $(this).attr("src");
                    }
                })
                if (by_id && by_id.find("span").length > 0) {
                    by_id.find("span").each(function () {
                        if ($(this).attr("data-testid") === "price" && $(this).text().includes("$")) {
                            ob.price = $(this).text().replace(/\D/g, "");
                            $(this).parent().parent().parent().children().each(function (index) {
                                if (index === 1) {
                                    ob.address = $(this).text().replace(/,/g, '-');
                                }
                            })
                        }
                        else if ($(this).attr("data-testid") === "bed-bath-item" && $(this).text().includes("bd")) {
                            ob.bedrooms = $(this).text().replace(/\D/g, "");
                        }
                        else if ($(this).attr("data-testid") === "bed-bath-item" && $(this).text().includes("ba")) {
                            ob.baths = $(this).text().replace(/\D/g, "");
                        }
                        else if ($(this).attr("data-testid") === "bed-bath-item" && $(this).text().includes("sqft")) {
                            ob.sq_ft = $(this).text().replace(/\D/g, "");
                        }

                    })
                }

                if (owner_details && owner_details.length > 0) {
                    owner_details.each(function () {
                        if ($(this).text().includes("Property Owner")) {
                            ob.seller_phone_number = $(this).text().split("Property Owner")[1];
                        }
                    });
                }
                ob.zillow_listing_url = $(location).attr('href');

                let btn = $("#addtolist-btn");
                if (btn.length <= 0) {
                    $('.summary-container').prepend('<div id="added_li"><button id="addtolist-btn" style="width:100%;background:red;color:white">ADD LISTING</button></div>');
                    $("#addtolist-btn").click(function () {

                        chrome.storage.sync.set({ list: ob }, function () {
                            $("#added_li").remove()
                        });
                        chrome.runtime.sendMessage({ type: "save_listing", data: ob }, function (res) {
                            chrome.storage.sync.set({ csv_url: res.csv_file }, function () { });
                        });

                    })
                }

                // clearInterval(check);
            }

        }, 1000)
    }
    else {
        alert("Please set API Key");
    }
})();

