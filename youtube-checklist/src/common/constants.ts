const INITITAL_DATA: number[] = []

const FIREBASE_INIT = {
  apiKey: 'AIzaSyCjpaGsi4DPpNDyCK1Da4dWmEcC2m-vkqE',
  authDomain: 'extension-sainitij.firebaseapp.com',
  projectId: 'extension-sainitij',
  storageBucket: 'extension-sainitij.appspot.com',
  messagingSenderId: '396804614578',
  appId: '1:396804614578:web:6e0050d673c2fc59ce1cab',
}
const MESSAGING = {
  ADD_NUMBER: 'ADD_NUMBER',
  REMOVE_NUMBER: 'REMOVE_NUMBER',
}

const EXTENSION_DATA = {
  homePageLink: 'https://www.website.com/',
  description:
    'YouTube Shorts Guide, Hacks and Monetization Checklist With Video Tutorials, Resources and Up To Date Algorithm Tips',
  descriptionLinkTitle: 'Get Crowdsourced YouTube Shorts Views',
  descriptionLink: 'https://www.youtube.com',
  groups: [
    {
      title: 'YouTube Shorts: An Overview',
      youtubeEmbedId: '9EJIH8kxTn8',
      checklists: [
        {
          checklistId: 1,
          description:
            'YouTube Shorts – they are the latest version of short videos that are popping up across social media.',
        },
        {
          checklistId: 2,
          description:
            'This is the YouTube version of TikTok and Instagram Reels that we’ve seen arise over the last year or so.',
        },
        {
          checklistId: 3,
          description:
            'But the real question is, can it be beneficial for your business, affiliate marketing campaigns and for your YouTube Channel?',
        },
        {
          checklistId: 4,
          description:
            'YouTube shorts is one of the most overpowered features I’ve ever seen on a social media platform. When you post a short it’s not too rare to wake up to more traffic than your previous channel traffic in total',
        },
        {
          checklistId: 5,
          description:
            'You may have seen how easy it is to go viral on TikTok right? Well from my experience it’s even easier through YouTube shorts...',
        },
        {
          checklistId: 6,
          description:
            'They’re designed on a model that feeds consumers content with the intention of the consumers staying on the app for as long as possible.',
        },
        {
          checklistId: 7,
          description:
            'Normal videos get uploaded, sent out to subscribers feeds, a percentage of impressions will convert into viewers and based on the metrics gathered from that sample the algorithm will decide whether to push it further.',
        },
        {
          checklistId: 8,
          description:
            'Shorts on the other hand don’t rely on that algorithm, the only metric that matters is viewer retention... As I said before, it’s just a blatant copy of TikTo',
        },
      ],
    },
    {
      title: 'How Do You Make Shorts?',
      youtubeEmbedId: 'fvH0BiYIoXc',
      checklists: [
        {
          checklistId: 9,
          description:
            'On your smartphone, if you hit the plus sign icon, you can then tap Create a Short. You’re then brought to a screen where you can record a clip directly with the YouTube camera, either front facing or by flipping to record on selfie cam. Or, you can also upload a clip from your camera roll.',
        },
        {
          checklistId: 10,
          description:
            'Now before Click Here To Grab YouTube Shorts Excellence HD Training Video you record, you’ll need to tap that 15 number to turn it to 60 if you want to record up to 60 seconds. Otherwise, it will end your video at 15 seconds when you’re recording.',
        },
        {
          checklistId: 11,
          description:
            'If you tap on Filters, you can tap through the different filters available for your video. You can click Timer to set a countdown to start or end a recording after so many seconds.',
        },
        {
          checklistId: 12,
          description:
            'This can be helpful if you’re recording yourself on the selfie cam and don’t want the action of your hand hitting record to be included in the video.',
        },
        {
          checklistId: 13,
          description:
            'You can also tap Speed to adjust how slow or how fast you want your video to play. And then, you can also tap Music to choose a song to go with your video.',
        },
        {
          checklistId: 14,
          description:
            'Once you’ve added everything that you wan t, you can tap on the next screen. You can add music here too if you didn’t do it on the previous screen. You can add text, adjust the size of it, the colour, and the placement of it. You can also adjust the timing of when you want the text to be on screen.',
        },
        {
          checklistId: 15,
          description:
            'So if you want different text to appear on screen at different times, this is where you adjust that. You can also adjust filters here if you didn’t do that on the previous screen. Once you’re satisfied, you can tap next',
          points: [
            {
              title: 'Enter your title and description',
            },
            {
              title: 'Select if the video is made for kids or not',
            },
            {
              title: 'If you want it to be public or not',
            },
            {
              title: '…and then hit Upload to post!',
            },
            {
              title: 'Download The PDF With Screenshots On How TO Make Shorts',
              url: 'https://www.dropbox.com/s/p480ie7keq3cfqa/YouTube%20Shorts%20Training%20Guide.pdf?dl=0',
            },
          ],
        },
      ],
    },
    {
      title: 'Important Things to Keep In Mind:',
      youtubeEmbedId: 'uBigHWVeSE4',
      checklists: [
        {
          checklistId: 16,
          description:
            'Just like TikTok and Instagram Reels, YouTube Shorts loop. So take advantage of that and make videos that encourage replays!',
        },
        {
          checklistId: 17,
          description:
            'It goes without saying that YouTube Shorts are short in nature! So you have to make the first few seconds captivating. If you can hook them in the first 3 second,s that’s even better.',
        },
        {
          checklistId: 18,
          description:
            'But putting #Shorts in your title and description would help it get picked up by YouTube as a Short.',
        },
        {
          checklistId: 19,
          description:
            'YouTube Creators said they recommend adding #Shorts to help with discovery.',
        },
      ],
    },
    {
      title: 'Compelling Reasons for Creating YouTube Shorts',
      youtubeEmbedId: 'njsbIPB-uCM',
      checklists: [
        {
          checklistId: 20,
          description: 'Brand Awareness',
          points: [
            {
              title:
                'YouTube Creators say that 15 billion people are already watching Shorts globally.',
            },
            {
              title:
                'And with what they said earlier about adding #Shor ts to help with discoverability.',
            },
            {
              title:
                'Shorts seem like a great way to reach new subscribers and increase your brand awareness on the platform.',
            },
            {
              title:
                'One tip we would suggest is to include Click Here To Grab YouTube Shorts Excellence HD Training Video value in the Short itself, while also pointing towards a related video on your channel for even more value.',
            },
          ],
        },
        {
          checklistId: 21,
          description: 'Reuse your Reels & TikToks',
          points: [
            { title: 'Work smarter not harder!' },
            {
              title:
                'If you’re already making Instagram Reels and TikToks, just repurpose them for YouTube Shorts.',
            },
            {
              title:
                'You’ll have to do a little bit of adjusting here and there to make them work for Shorts.',
            },
            {
              title:
                'But it’s doable and will save you way more time than trying to think of things from scratch for a third platform',
            },
            {
              title:
                'Just remember that Shorts only lets you play music for 15 seconds. So, you may need to adjust videos that were originally made with the intention of having music play longer than that.',
            },
            {
              title:
                'Additionally, if you export videos from TikTok or Instagram after they’ve already published, they will come out with either:  The TikTok or the Instagram reels watermark',
            },
            {
              title:
                'So, make sure you save the original video, without a watermark, to upload to Shorts.',
            },
          ],
        },
        {
          checklistId: 22,
          description: 'Provide more value',
          points: [
            {
              title:
                'If you’re not already posting Reels or TikToks and need to come up with some ideas from scratch for your YouTube Shorts, we would say above all just provide value.',
            },
            {
              title:
                'Value can come in many forms whether it’s via quick tips, a how -to, something funny or entertaining, etc.',
            },
            {
              title:
                'Think about the pain points or goals your audience has as they relate to your business and industry, then tackle those pain points and goals with your Shorts.',
            },
          ],
        },
      ],
    },
    {
      title: 'YouTube Shorts Algorithm Hacks',
      youtubeEmbedId: '6O4ZrM9ukqQ',
      checklists: [
        {
          checklistId: 23,
          description:
            'I binge watched video tutorials on YouTube shorts over 5 days and these are the top algorithm hacks from top YouTube creators',
        },
        {
          checklistId: 24,
          description: 'The key for the algorithm is what you put in the first 3 seconds',
          points: [
            {
              title: "The first 3 seconds you'll need to say what video is about.",
            },
            {
              title: 'The visual should match the topic in those 3 seconds',
            },
          ],
        },
        {
          checklistId: 25,
          description: 'You should have sub titles all way through.',
        },
        {
          checklistId: 26,
          description:
            'If your Shorts video is more than 30 seconds must be minimum 80% watch time',
        },
        {
          checklistId: 27,
          description: 'If under 30 seconds must be 100% watch time.',
        },
        {
          checklistId: 28,
          description:
            "The 7X Rule - For every 1000 views they get you'll get 7000 impressions on suggested shorts",
        },
        {
          checklistId: 29,
          description: 'Custom YouTube Shorts thumbnails is a trick to trigger the Algorithm',
        },
        {
          checklistId: 30,
          description:
            'Get High Quality YouTube Shorts Made For You If Not Using Your Phone With The YouTube App',
          points: [
            {
              title: 'If Getting One Made Then Ask Your Video Editor To Add a Call To Action',
            },
            {
              title:
                'Also Ask To Add Animated Subscribe, Bell & Like Button Video With Sound Effects',
            },
          ],
        },
        {
          checklistId: 31,
          description: 'Subscribers are Important In TWO Ways',
          points: [
            {
              title:
                'The Algorithm Likes When You EARN Subscribers at a High Percentage From Your Shorts',
            },
            {
              title:
                'And It Also Likes If Your Have Returning Subscribers Watching New Shorts Your Publish',
            },
          ],
        },
        {
          checklistId: 32,
          description:
            'Your title needs to be under 55 characters (adding The #shorts hashtag to that will not count in those 55 characters, so add it in your title and description',
        },
        {
          checklistId: 33,
          description:
            'The MAIN Algorithm Factor is Watch Time Which Can be Affected By Retention Time',
          points: [
            {
              title: 'Check Out My Crowdsourced YouTube Shorts (High Retention Views) Product',
              url: 'https://www.website.com/',
            },
          ],
        },
        {
          checklistId: 34,
          description: 'Use My Broad Optimization Title Hack (It Works!)',
          points: [
            {
              title:
                'Research keywords. You can use the Keyword Intent free keyword tool to help with this.',
              url: 'https://keywordintent.io/',
            },
          ],
        },
        {
          checklistId: 35,
          description: 'Create Custom Thumbnails for Your Shorts',
          points: [
            {
              title: 'Select a frame from the video that represents what it’s about.',
            },
            {
              title: 'You can also create custom thumbnails with Canva',
            },
            {
              title: 'Or Use This Service To get High Quality Thumbnail Created For You',
            },
            {
              title: 'Upload it to YouTube',
            },
          ],
        },
        {
          checklistId: 36,
          description: 'Post a comment on your short video',
          points: [
            {
              title: 'Ask a question that encourages engagement',
            },
            {
              title: 'Pin Your Comment',
            },
            {
              title: 'Add a Link In Your Comment With a Call To Action',
            },
            {
              title: 'Ask Them to Like and Subscribe Too',
            },
          ],
        },
        {
          checklistId: 37,
          description: 'YES, Use Clickbait Headlines... But Deliver On The Promise',
          points: [
            {
              title: 'You’ll see a higher click-through rate',
            },
            {
              title: "It Shouldn't Be Misleading But Talk UP What Your Content Is About",
            },
            {
              title: "re-emphasize the headline in the 'First 3 Seconds'",
            },
          ],
        },
        {
          checklistId: 38,
          description: 'Write Quality Headlines and Descriptions',
          points: [
            {
              title: 'Add Your Title Within Your First 3 Lines',
            },
            {
              title: 'Use A Copywriting Headline Formula',
            },
            {
              title: 'Use Curiosity In Your Headline',
            },
            {
              title:
                'Use action verbs: Action verbs trigger emotions, and emotions trigger clicks. Read, watch, act!',
            },
            {
              title:
                'Ask a question: Address the audience directly with a question that tickles their curiosity.',
            },
            {
              title:
                'Look at Ad Headlines For Ideas, Advertisers Pay For Every Click, They Have Bought The data To Know What Works',
            },
            {
              title:
                'Try experimenting with full CAPS titles as these can bring a sense of urgency and generally provoke a quicker, more intense emotional response from the viewer which can lead to quicker and more clicks.',
            },
            {
              title: 'Stick to how-to titles for educational content',
            },
            {
              title:
                'Experiment With Create Listicle-style Titles and Content As It Keeps People Watching To Discover All The List Items',
            },
            {
              title: 'Top 3, 5, and 10 lists are a classic technique that always gets results',
            },
            {
              title: 'Make sure your video title and thumbnail work well together',
            },
            {
              title:
                "Study your competitors’ videos For Ideas and discover what's working for them",
            },
          ],
        },
        {
          checklistId: 39,
          description:
            'Share Your Shorts Videos In Your YouTube Community Tab, Facebook, Linkedin, and Any Other Social Platform',
        },
        {
          checklistId: 40,
          description: 'Add a Shorts Section To Your YouTube Homepage',
        },
      ],
    },
    {
      title: 'Resources',
      youtubeEmbedId: 'C3lQW9yljbI',
      checklists: [
        {
          checklistId: 41,
          description: 'Get Crowdsourced Video Views For Shorts And Normal Videos',
        },
        {
          checklistId: 42,
          description: 'The FASTEST Way To Build An Affiliate List (Or Any Other Email List)',
        },
      ],
    },
  ],
}
const EXTENSION_DATA1 = {
  homePageLink: 'https://www.website.com/',
  description:
    'YouTube Shorts Guide, Hacks and Monetization Checklist With Video Tutorials, Resources and Up To Date Algorithm Tips',
  descriptionLinkTitle: 'Get Crowdsourced YouTube Shorts Views',
  descriptionLink: 'https://www.youtube.com',
  groups: [
    {
      title: 'YouTube Shorts: An Overview',
      youtubeEmbedId: '9EJIH8kxTn8',
      checklists: [
        {
          checklistId: 1,
          description:
            'YouTube Shorts – they are the latest version of short videos that are popping up across social media.',
        },
        {
          checklistId: 2,
          description:
            'This is the YouTube version of TikTok and Instagram Reels that we’ve seen arise over the last year or so.',
        },
        {
          checklistId: 3,
          description:
            'But the real question is, can it be beneficial for your business, affiliate marketing campaigns and for your YouTube Channel?',
        },
        {
          checklistId: 4,
          description:
            'YouTube shorts is one of the most overpowered features I’ve ever seen on a social media platform. When you post a short it’s not too rare to wake up to more traffic than your previous channel traffic in total',
        },
        {
          checklistId: 5,
          description:
            'You may have seen how easy it is to go viral on TikTok right? Well from my experience it’s even easier through YouTube shorts...',
        },
        {
          checklistId: 6,
          description:
            'They’re designed on a model that feeds consumers content with the intention of the consumers staying on the app for as long as possible.',
        },
        {
          checklistId: 7,
          description:
            'Normal videos get uploaded, sent out to subscribers feeds, a percentage of impressions will convert into viewers and based on the metrics gathered from that sample the algorithm will decide whether to push it further.',
        },
        {
          checklistId: 8,
          description:
            'Shorts on the other hand don’t rely on that algorithm, the only metric that matters is viewer retention... As I said before, it’s just a blatant copy of TikTo',
        },
      ],
    },
    {
      title: 'How Do You Make Shorts?',
      youtubeEmbedId: 'fvH0BiYIoXc',
      checklists: [
        {
          checklistId: 9,
          description:
            'On your smartphone, if you hit the plus sign icon, you can then tap Create a Short. You’re then brought to a screen where you can record a clip directly with the YouTube camera, either front facing or by flipping to record on selfie cam. Or, you can also upload a clip from your camera roll.',
        },
        {
          checklistId: 10,
          description:
            'Now before Click Here To Grab YouTube Shorts Excellence HD Training Video you record, you’ll need to tap that 15 number to turn it to 60 if you want to record up to 60 seconds. Otherwise, it will end your video at 15 seconds when you’re recording.',
        },
        {
          checklistId: 11,
          description:
            'If you tap on Filters, you can tap through the different filters available for your video. You can click Timer to set a countdown to start or end a recording after so many seconds.',
        },
        {
          checklistId: 12,
          description:
            'This can be helpful if you’re recording yourself on the selfie cam and don’t want the action of your hand hitting record to be included in the video.',
        },
        {
          checklistId: 13,
          description:
            'You can also tap Speed to adjust how slow or how fast you want your video to play. And then, you can also tap Music to choose a song to go with your video.',
        },
        {
          checklistId: 14,
          description:
            'Once you’ve added everything that you wan t, you can tap on the next screen. You can add music here too if you didn’t do it on the previous screen. You can add text, adjust the size of it, the colour, and the placement of it. You can also adjust the timing of when you want the text to be on screen.',
        },
        {
          checklistId: 15,
          description:
            'So if you want different text to appear on screen at different times, this is where you adjust that. You can also adjust filters here if you didn’t do that on the previous screen. Once you’re satisfied, you can tap next',
          points: [
            {
              title: 'Enter your title and description',
            },
            {
              title: 'Select if the video is made for kids or not',
            },
            {
              title: 'If you want it to be public or not',
            },
            {
              title: '…and then hit Upload to post!',
            },
            {
              title: 'Download The PDF With Screenshots On How TO Make Shorts',
              url: 'https://www.dropbox.com/s/p480ie7keq3cfqa/YouTube%20Shorts%20Training%20Guide.pdf?dl=0',
            },
          ],
        },
      ],
    },
    {
      title: 'Important Things to Keep In Mind:',
      youtubeEmbedId: 'uBigHWVeSE4',
      checklists: [
        {
          checklistId: 16,
          description:
            'Just like TikTok and Instagram Reels, YouTube Shorts loop. So take advantage of that and make videos that encourage replays!',
        },
        {
          checklistId: 17,
          description:
            'It goes without saying that YouTube Shorts are short in nature! So you have to make the first few seconds captivating. If you can hook them in the first 3 second,s that’s even better.',
        },
        {
          checklistId: 18,
          description:
            'But putting #Shorts in your title and description would help it get picked up by YouTube as a Short.',
        },
        {
          checklistId: 19,
          description:
            'YouTube Creators said they recommend adding #Shorts to help with discovery.',
        },
      ],
    },
    {
      title: 'Compelling Reasons for Creating YouTube Shorts',
      youtubeEmbedId: 'njsbIPB-uCM',
      checklists: [
        {
          checklistId: 20,
          description: 'Brand Awareness',
          points: [
            {
              title:
                'YouTube Creators say that 15 billion people are already watching Shorts globally.',
            },
            {
              title:
                'And with what they said earlier about adding #Shor ts to help with discoverability.',
            },
            {
              title:
                'Shorts seem like a great way to reach new subscribers and increase your brand awareness on the platform.',
            },
            {
              title:
                'One tip we would suggest is to include Click Here To Grab YouTube Shorts Excellence HD Training Video value in the Short itself, while also pointing towards a related video on your channel for even more value.',
            },
          ],
        },
        {
          checklistId: 21,
          description: 'Reuse your Reels & TikToks',
          points: [
            { title: 'Work smarter not harder!' },
            {
              title:
                'If you’re already making Instagram Reels and TikToks, just repurpose them for YouTube Shorts.',
            },
            {
              title:
                'You’ll have to do a little bit of adjusting here and there to make them work for Shorts.',
            },
            {
              title:
                'But it’s doable and will save you way more time than trying to think of things from scratch for a third platform',
            },
            {
              title:
                'Just remember that Shorts only lets you play music for 15 seconds. So, you may need to adjust videos that were originally made with the intention of having music play longer than that.',
            },
            {
              title:
                'Additionally, if you export videos from TikTok or Instagram after they’ve already published, they will come out with either:  The TikTok or the Instagram reels watermark',
            },
            {
              title:
                'So, make sure you save the original video, without a watermark, to upload to Shorts.',
            },
          ],
        },
        {
          checklistId: 22,
          description: 'Provide more value',
          points: [
            {
              title:
                'If you’re not already posting Reels or TikToks and need to come up with some ideas from scratch for your YouTube Shorts, we would say above all just provide value.',
            },
            {
              title:
                'Value can come in many forms whether it’s via quick tips, a how -to, something funny or entertaining, etc.',
            },
            {
              title:
                'Think about the pain points or goals your audience has as they relate to your business and industry, then tackle those pain points and goals with your Shorts.',
            },
          ],
        },
      ],
    },
    {
      title: 'YouTube Shorts Algorithm Hacks',
      youtubeEmbedId: '6O4ZrM9ukqQ',
      checklists: [
        {
          checklistId: 23,
          description:
            'I binge watched video tutorials on YouTube shorts over 5 days and these are the top algorithm hacks from top YouTube creators',
        },
        {
          checklistId: 24,
          description: 'The key for the algorithm is what you put in the first 3 seconds',
          points: [
            {
              title: "The first 3 seconds you'll need to say what video is about.",
            },
            {
              title: 'The visual should match the topic in those 3 seconds',
            },
          ],
        },
        {
          checklistId: 25,
          description: 'You should have sub titles all way through.',
        },
        {
          checklistId: 26,
          description:
            'If your Shorts video is more than 30 seconds must be minimum 80% watch time',
        },
        {
          checklistId: 27,
          description: 'If under 30 seconds must be 100% watch time.',
        },
        {
          checklistId: 28,
          description:
            "The 7X Rule - For every 1000 views they get you'll get 7000 impressions on suggested shorts",
        },
        {
          checklistId: 29,
          description: 'Custom YouTube Shorts thumbnails is a trick to trigger the Algorithm',
        },
        {
          checklistId: 30,
          description:
            'Get High Quality YouTube Shorts Made For You If Not Using Your Phone With The YouTube App',
          points: [
            {
              title: 'If Getting One Made Then Ask Your Video Editor To Add a Call To Action',
            },
            {
              title:
                'Also Ask To Add Animated Subscribe, Bell & Like Button Video With Sound Effects',
            },
          ],
        },
        {
          checklistId: 31,
          description: 'Subscribers are Important In TWO Ways',
          points: [
            {
              title:
                'The Algorithm Likes When You EARN Subscribers at a High Percentage From Your Shorts',
            },
            {
              title:
                'And It Also Likes If Your Have Returning Subscribers Watching New Shorts Your Publish',
            },
          ],
        },
        {
          checklistId: 32,
          description:
            'Your title needs to be under 55 characters (adding The #shorts hashtag to that will not count in those 55 characters, so add it in your title and description',
        },
        {
          checklistId: 33,
          description:
            'The MAIN Algorithm Factor is Watch Time Which Can be Affected By Retention Time',
          points: [
            {
              title: 'Check Out My Crowdsourced YouTube Shorts (High Retention Views) Product',
              url: 'https://www.website.com/',
            },
          ],
        },
        {
          checklistId: 34,
          description: 'Use My Broad Optimization Title Hack (It Works!)',
          points: [
            {
              title:
                'Research keywords. You can use the Keyword Intent free keyword tool to help with this.',
              url: 'https://keywordintent.io/',
            },
          ],
        },
        {
          checklistId: 35,
          description: 'Create Custom Thumbnails for Your Shorts',
          points: [
            {
              title: 'Select a frame from the video that represents what it’s about.',
            },
            {
              title: 'You can also create custom thumbnails with Canva',
            },
            {
              title: 'Or Use This Service To get High Quality Thumbnail Created For You',
            },
            {
              title: 'Upload it to YouTube',
            },
          ],
        },
        {
          checklistId: 36,
          description: 'Post a comment on your short video',
          points: [
            {
              title: 'Ask a question that encourages engagement',
            },
            {
              title: 'Pin Your Comment',
            },
            {
              title: 'Add a Link In Your Comment With a Call To Action',
            },
            {
              title: 'Ask Them to Like and Subscribe Too',
            },
          ],
        },
        {
          checklistId: 37,
          description: 'YES, Use Clickbait Headlines... But Deliver On The Promise',
          points: [
            {
              title: 'You’ll see a higher click-through rate',
            },
            {
              title: "It Shouldn't Be Misleading But Talk UP What Your Content Is About",
            },
            {
              title: "re-emphasize the headline in the 'First 3 Seconds'",
            },
          ],
        },
        {
          checklistId: 38,
          description: 'Write Quality Headlines and Descriptions',
          points: [
            {
              title: 'Add Your Title Within Your First 3 Lines',
            },
            {
              title: 'Use A Copywriting Headline Formula',
            },
            {
              title: 'Use Curiosity In Your Headline',
            },
            {
              title:
                'Use action verbs: Action verbs trigger emotions, and emotions trigger clicks. Read, watch, act!',
            },
            {
              title:
                'Ask a question: Address the audience directly with a question that tickles their curiosity.',
            },
            {
              title:
                'Look at Ad Headlines For Ideas, Advertisers Pay For Every Click, They Have Bought The data To Know What Works',
            },
            {
              title:
                'Try experimenting with full CAPS titles as these can bring a sense of urgency and generally provoke a quicker, more intense emotional response from the viewer which can lead to quicker and more clicks.',
            },
            {
              title: 'Stick to how-to titles for educational content',
            },
            {
              title:
                'Experiment With Create Listicle-style Titles and Content As It Keeps People Watching To Discover All The List Items',
            },
            {
              title: 'Top 3, 5, and 10 lists are a classic technique that always gets results',
            },
            {
              title: 'Make sure your video title and thumbnail work well together',
            },
            {
              title:
                "Study your competitors’ videos For Ideas and discover what's working for them",
            },
          ],
        },
        {
          checklistId: 39,
          description:
            'Share Your Shorts Videos In Your YouTube Community Tab, Facebook, Linkedin, and Any Other Social Platform',
        },
        {
          checklistId: 40,
          description: 'Add a Shorts Section To Your YouTube Homepage',
        },
      ],
    },
    {
      title: 'Resources',
      youtubeEmbedId: 'C3lQW9yljbI',
      checklists: [
        {
          checklistId: 41,
          description: 'Get Crowdsourced Video Views For Shorts And Normal Videos',
        },
        {
          checklistId: 42,
          description: 'The FASTEST Way To Build An Affiliate List (Or Any Other Email List)',
        },
      ],
    },
  ],
}
export { INITITAL_DATA, MESSAGING, EXTENSION_DATA, FIREBASE_INIT, EXTENSION_DATA1 }
