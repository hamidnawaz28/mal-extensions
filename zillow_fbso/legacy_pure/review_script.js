(async function () {
    let api = await chrome.storage.sync.get(["api"]);  

    if(api && api.api){
    let ob = { api_key: api.api, type: 'real_estate_review', date: "", reviewer_name: "",headline: "", local_knowledge: 0, process_expertise: 0, responsiveness: 0, negotiation_skills: 0, total_score: 0, body:"" };
    let check = setInterval(function () {
        if($(".btn_add").length<=0){
        let reviews = $("#reviews").find("div[role='status']").find("li");
        if(reviews && reviews.length>0)
        {
            reviews.each(function(index){
                $(this).append('<button class="btn_add" style="width:100%; background:blue;color:white;font-weight:bold">Save Review</button>');
               })
            
               $(".btn_add").each(function()
               {
                $(this).click(function(){
                    ob = { api_key: api.api, type: 'real_estate_review', date: "", reviewer_name: "",headline: "", local_knowledge: 0, process_expertise: 0, responsiveness: 0, negotiation_skills: 0, total_score: 0, body:"" };
                    let score= $(this).parent().children().children().first().text().split("||");
                    ob.total_score = parseFloat(score[1]) > 5?5:parseFloat(score[1]);
                    let name_date = $(this).parent().children().eq(1).html().split("-");
                    ob.date = name_date[0];
                    ob.reviewer_name = name_date[1].split("<br>")[0].trim();
                    ob.headline = name_date[1].split("<br>")[1];

                    let ratings= $(this).parent().children().eq(2).children();

                    let local_knowledge_svg =ratings.children().eq(0).find("path");
                    let local_knowledge = 0;
                    let positive = "M28.28 11.46L21 10.12l-3.52-6.9c-.83-1.63-2.19-1.63-3 0L11 10.12l-7.28 1.34c-1.8.34-2.26 1.71-1 3.06l5.16 5.6-1 7.78c-.24 1.8.9 2.6 2.53 1.77L16 26.3l6.65 3.37c1.63.83 2.77 0 2.53-1.77l-1-7.78 5.16-5.6c1.2-1.35.74-2.72-1.06-3.06z";
                    local_knowledge_svg.each(function(){
                        if($(this).attr("d").includes(positive)){
                            local_knowledge = local_knowledge+1;
                        }
                    })
                    ob.local_knowledge = local_knowledge;
                    
                    let process_expertise_svg =ratings.children().eq(1).find("path");
                    let process_expertise = 0;
                    process_expertise_svg.each(function(){
                        if($(this).attr("d").includes(positive)){
                            process_expertise = process_expertise+1;
                        }
                    })
                    ob.process_expertise = process_expertise;
                    
                    let responsiveness_svg =ratings.children().eq(2).find("path");
                    let responsiveness = 0;
                    responsiveness_svg.each(function(){
                        if($(this).attr("d").includes(positive)){
                            responsiveness = responsiveness+1;
                        }
                    })
                    ob.responsiveness = responsiveness;
                    
                    let negotiation_skills_svg =ratings.children().eq(3).find("path");
                    let negotiation_skills = 0;
                    negotiation_skills_svg.each(function(){
                        if($(this).attr("d").includes(positive)){
                            negotiation_skills = negotiation_skills+1;
                        }
                    })
                    ob.negotiation_skills = negotiation_skills;

                    ob.body = $(this).parent().children().eq(3).text().replace("Show more","");

                    $(this).remove();

                    chrome.runtime.sendMessage({type: "save_reviews",data:ob},function(res){
                        if(!res.success){
                            alert(res.message);
                        }
                    });
                })

               })
            
            //    clearInterval(check);
        }
    }
    //    console.log(reviews);

    // console.log($(".PaginationNumberItem-c11n-8-96-2__sc-i6f8qs-0.jYjrMd"));
    // console.log($("nav").find("[aria-label='Pages of reviews']"));


    // let nav;
    // $("nav").each(function() {
    //     let dom= this;
    //     $.each(this.attributes, function() {
            
    //         if(this.name === "aria-label" && this.value.includes("Pages of reviews"))
    //         {
    //             nav= dom;
    //             let next = $(nav).find("button[title='Next page']");
    //             $(next).click();
    //             console.log(this.name, this.value,$(nav).find("button[title='Next page']"));
    //         }
            
    //     });
    //   });

    }, 500)
}
else {
    alert("Please set API Key");
}
})();

