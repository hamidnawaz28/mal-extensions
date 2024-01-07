let message_extension = [{ type: "FSBO_LISTING", extension: "_listing" }, { type: "ZILLOW_REVIEWS", extension: "_reviews" }, { type: "AGENT_LISTING", extension: "_agent" }];
let current_type = "_listing";
$("#api_key").change(function () {
    chrome.storage.sync.set({ api: $("#api_key").val() }, function () { });
})
$("#ddl_list").change(function () {
    chrome.runtime.sendMessage({ type: "change_setting", list_type: $("#ddl_list").val() }, function (res) {
        current_type = message_extension.find(el => el.type === res.data.scrape_type);
        load();
    });
})
$("#btn-del-all").click(function () {
    chrome.runtime.sendMessage({ type: "delete_all" + current_type, data: { api_key: $("#api_key").val(), type: "delete_all" } }, function (res) { });
})
$("#btn-ref").click(function () {
    $("#list_container").empty();
    load();
})

$("#btn-download").click(function () {
    chrome.tabs.create({ url: $("#btn-download").attr("href") });
})
$("#help").click(function () {
    chrome.tabs.create({ url: "http://www.realestatescrape.com/" });
})
$("#inpt-search").change(function () {
    $(".list_row").each(function () {
        if (!$(this).text().includes($("#inpt-search").val())) {
            $(this).hide();
        }
        else {
            $(this).show();
        }
    })
})
load();
function load() {
    chrome.runtime.sendMessage({ type: "get_setting" }, function (res) {
        $("#list_container").empty();
        let ob = message_extension.find(el => el.type === res.data.scrape_type);
        current_type = ob.extension;
        console.log(current_type);
        $("#ddl_list").val(ob.type);
        if (ob.type == "FSBO_LISTING") {
            fsbo_list();
        }
        else if (ob.type == "ZILLOW_REVIEWS") {
            load_review_list();
        }
        else if (ob.type == "AGENT_LISTING") {
            load_agent_list();
        }
    })
}

function fsbo_list() {
    $("#list_description").text("In the table below, you will see all of your scraped FSBO listings. The Listings will automatically connect with your Go High Level CRM. You can also download the list manually by clicking on the download button.");
    chrome.storage.sync.get(["api"], function (result) {
        if (result && result.api && result.api.length > 10) {
            $("#api_key").val(result.api);
            let current_type = "_listing";
            chrome.runtime.sendMessage({ type: "get_info" + current_type, data: { api_key: result.api, type: "get_info" } }, function (res) {
                let list = res.list;
                $("#btn-download").attr("href", res.csv_url)
                list.forEach(function (list) {
                    if (Object.keys(list).length > 3) {
                        $("#list_container").append('<div class="row list_row"><div class="col-xs-6"><img src="' + list.image + '" style="width: 100%;height: 100%"/><br></div><div class="col-xs-6 text-left"><p id="list_description_' + list.id + '"> <b> PRICE:' + list.price + '<br>ADDRESS: ' + list.address + ' <br> BEDROOMS: ' + list.bedrooms + ' <br> Baths: ' + list.baths + ' <br> SQ.FT: ' + list.sq_ft + ' <br> Phone:' + list.seller_phone_number + ' <br> Zillow Listing URL: ' + list.zillow_listing_url + ' </b><br><span style="margin-right:10px" class="btn btn-info btn-xs btn-del-single" data-id="' + list.id + '">DELETE LISTING</span></p></div></div>');
                    }
                });
                $(".btn-del-single").each(function () {
                    $(this).click(function () {
                        chrome.runtime.sendMessage({ type: "delete" + current_type, data: { api_key: $("#api_key").val(), type: "delete", real_estate_listing_id: parseInt($(this).attr("data-id")) } }, function (res) { });
                    })

                })
            });
        }
        else {
            $("#error_info").text("Please put API Key");
        }
    })


}

function load_review_list() {
    $("#list_description").text("In the table below, you will see all of your scraped Zillow reviews. The reviews will show up on your website review widget.");
    chrome.storage.sync.get(["api"], function (result) {
        if (result && result.api && result.api.length > 10) {
            $("#api_key").val(result.api);
            chrome.runtime.sendMessage({ type: "get_info" + current_type, data: { api_key: result.api, type: "get_info" } }, function (res) {
                console.log(res);
                let list = res.list;
                $("#btn-download").attr("href", res.csv_url)
                list.forEach(function (list) {
                    if (Object.keys(list).length > 3) {
                        $("#list_container").append('<div class="row list_row"><div class="col-xs-12"><h3>' + list.headline + '<h3/><br><p>Name: ' + list.reviewer_name + ' Score: ' + list.total_score + ' Date: ' + list.date + '<br> Local Knowledge: ' + list.local_knowledge + ' Process Expertise: ' + list.process_expertise + ' Responsiveness: ' + list.responsiveness + ' Negotiation Skill: ' + list.negotiation_skills + '</p><br><p>' + list.body + '</p><br><button class="btn btn-info btn-del-single" data-id="' + list.id + '">DELETE REVIEW</button></div>');
                        $(".btn-del-single").each(function () {
                            $(this).click(function () {
                                chrome.runtime.sendMessage({ type: "delete" + current_type, data: { api_key: $("#api_key").val(), type: "delete", real_estate_review_id: parseInt($(this).attr("data-id")) } }, function (res) { });
                            })

                        })
                    }
                });
            });
        }
        else {
            $("#error_info").text("Please put API Key");
        }
    })

}
function load_agent_list() {

    $("#list_description").text("In the table below, you will see all of your scraped Agent Listings. These listings will show upon your website widget and also in your Facebook Ads Catalog");
    chrome.storage.sync.get(["api"], function (result) {
        if (result && result.api && result.api.length > 10) {
            $("#api_key").val(result.api);
            chrome.runtime.sendMessage({ type: "get_info" + current_type, data: { api_key: result.api } }, function (res) {
                let ob = res.data && res.data.lists && res.data.lists.length > 0 ? res.data.lists : [];
                console.log(res.data, ob);
                ob.forEach((i, index) => {
                    $("#list_container").append('<div class="row tbl_item_list list_row"><div class="col-xs-6"><a href="" class ="list_clickable" data-id="' + index + '"><img src="' + i.images[0] + '" style="width: 100%;height: 100%"/></a></div><div class="col-xs-6 text-left"><p id="list_details_' + index + '"> <b> PRICE:' + i.price + '<br>ADDRESS: ' + i.address + ' <br> BEDROOMS: ' + i.bedrooms + ' <br> Baths: ' + i.baths + ' <br> SQ.FT: ' + i.sq_ft + ' <br> Phone: ' + i.seller_phone_number + ' <br> Zillow Listing URL: ' + i.zillow_listing_url + ' <br> <span style="margin-top:10px;margin-right:10px" class="btn btn-info btn-xs btn-del-single" data-id="' + i.id + '">DELETE LISTING</span><span style="margin-top:10px;margin-right:10px" class="btn btn-info btn-xs btn-edit-single" data-id="' + index + '">EDIT LISTING</span></p></div></div>')
                })
                $(".btn-edit-single").each(function () {
                    $(this).click(function () {
                        let id = $(this).attr("data-id");
                        $("#list_details_" + id).hide();
                        let list_ob = ob[parseInt(id)];
                        $("#list_details_" + id).parent().append('<form id="list_details_edit_form_' + id + '"><div class="form-row"> <div class="col"> Price: <input class="form-control" name="price" size="6" value ="' + list_ob.price + '"/> </div> <div class="col"> Beds: <input class="form-control" name="bedrooms" size="3" value ="' + list_ob.bedrooms + '"/> </div> </div> <div class="col"> Baths: <input class="form-control" name="baths" size="3" value ="' + list_ob.baths + '"/> </div> <div class="col"> SQ.FT: <input class="form-control" name="sq_ft" size="3" value ="' + list_ob.sq_ft + '"/></div> <div class="col"> Phone  :<input class="form-control" name="seller_phone_number" size="15" value ="' + list_ob.seller_phone_number + '"/></div> <div class="col"> Address: <input class="form-control" name="address" size="50" value ="' + list_ob.address + '"/><div> <div class="col"> URL   : <input  class="form-control" name="zillow_listing_url" size="80" value ="' + list_ob.zillow_listing_url + '"/></div><button class ="btn btn-xs btn-info" id ="btn_list_details_update_' + id + '">Save Changes</button></form>');
                        $("#btn_list_details_update_" + id).click(function () {
                            $("#list_details_edit_form_" + id).find("input").each(function () {
                                console.log($(this).attr("name"), $(this).val());
                            })
                            $("#list_details_edit_form_" + id).remove();
                            $("#list_details_" + id).show();
                        });
                    })

                })
                $(".list_clickable").each(function () {
                    $(this).click(function (e) {
                        e.preventDefault();
                        $(".tbl_item_list").hide();
                        ob = ob[parseInt($(this).attr("data-id"))];
                        let list = "<div id='list_details'><ul class='text-center'>";
                        list = list + "<li><h3>What's special</h3></li><br><li><h6>" + ob.special + "</h6></li>";
                        list = list + "<li><h3>" + ob.fact_features.title + "</h3></li><br>";
                        ob.fact_features.values.forEach((l) => {
                            list = list + "<li><h4>" + l.heading + "</h4></li><br>";
                            l.values.forEach((f) => {
                                list = list + "<li><h5>" + f.subtitle + "</h5></li><br>";
                                f.values.forEach((s) => {
                                    list = list + "<li><h6>" + s.key + " :" + s.value + "</h6></li>";
                                })
                                list = list + "<br>";
                            })

                        })
                        list = list + "</ul>";


                        list = list + "<h3>Images</h3>";
                        ob.images.forEach((i) => {
                            list = list + "<div class='col-xs-3'><img  src='" + i + "' style='margin-bottom:20px;height:100%;width:100%'/></div>";
                        })
                        list = list + "<div class='col-xs-12 text-center'><button class='btn btn-info' id='btn_show_list'>Go to list</button></div></div>";
                        $("#list_container").append(list);
                        $("#btn_show_list").click(() => {
                            $(".tbl_item_list").remove();
                            $("#list_details").remove();
                            load_agent_list();
                        })
                    })
                })
            })

        }
        else {
            $("#error_info").text("Please put API Key");
        }
    })
}