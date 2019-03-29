const fetch = require('node-fetch');
exports.handler = (event, context, callback) => {
    try {
        if (event.request.type === 'LaunchRequest') {
            callback(null, buildResponse('Welcome to the Nextdoor Milwaukee Logging Utility'));
        } else if (event.request.type === 'IntentRequest') {
            const intentName = event.request.intent.name;

            if (intentName === 'feeding') {
                var teacherName = String(event.request.intent.slots.teacherName.value);
                var foodDetails = String(event.request.intent.slots.foodDetails.value);
                var studentName = String(event.request.intent.slots.studentName.value);
                postData(teacherName, studentName, "Food", foodDetails);
                
                
            } else if(intentName === 'startNap') {
                teacherName = String(event.request.intent.slots.teacherName.value);
                studentName = String(event.request.intent.slots.studentName.value);
                postData(teacherName, studentName, "Nap", "Started");
            }
            else if(intentName === 'endNap') {
                teacherName = String(event.request.intent.slots.teacherName.value);
                studentName = String(event.request.intent.slots.studentName.value);
                postData(teacherName, studentName, "Nap", "Ended");

            }
            else if(intentName === 'iNeed') {
                teacherName = String(event.request.intent.slots.teacherName.value);
                studentName = String(event.request.intent.slots.studentName.value);
                var object = String(event.request.intent.slots.object.value);
                postData(teacherName, studentName, "Needs", object);

            }
            else if(intentName === 'injury') {
                teacherName = String(event.request.intent.slots.teacherName.value);
                studentName = String(event.request.intent.slots.studentName.value);
                var injuryOccured = String(event.request.intent.slots.injuryOccured.value);
                postData(teacherName, studentName, "Injury", injuryOccured);
                
            }
            else if(intentName === 'activity') {
                teacherName = String(event.request.intent.slots.teacherName.value);
                studentName = String(event.request.intent.slots.studentName.value);
                var activityOccured = String(event.request.intent.slots.activityOccured.value);
                postData(teacherName, studentName, "Activity", activityOccured);
                
            }
            else if(intentName === 'accomplishments') {
                teacherName = String(event.request.intent.slots.teacherName.value);
                studentName = String(event.request.intent.slots.studentName.value);
                var accomplishment = String(event.request.intent.slots.accomplishment.value);
                postData(teacherName, studentName, "Accomplishment", accomplishment);
            }
            else if(intentName === 'diaperChange') {
                teacherName = String(event.request.intent.slots.teacherName.value);
                studentName = String(event.request.intent.slots.studentName.value);
                studentName = studentName.replace("'s",'');
                console.log(studentName);
                postData(teacherName, studentName, "Diaper", "" );
            }
            else{
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse(`Sorry, i didn't understand that request`, true),
                    {}
                  )
                );
            }
        } else if (event.request.type === 'SessionEndedRequest') {
            callback(null, buildResponse('Session Ended'));
        }
    } catch (e) {
        context.fail(`Exception: ${e}`);
    }
function buildResponse(response) {
    return {
        version: '1.0',
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: response,
            },
            shouldEndSession: true,
        },
        sessionAttributes: {},
    };
}
function postData(teacherName, studentName, type, details){
  var body = JSON.stringify(
        {"method": "new",  
         "studentNickName": studentName,
         "teacherNickName": teacherName,
         "activityType": type,
         "activityDetails": details});

  fetch('https://p6k336tkzj.execute-api.us-east-1.amazonaws.com/production/logs', {
      method: "POST",
      headers:{
        'Content-Type': 'application/json'
      },
      body: body
      }).then(response => {if(response.status === 200){
      context.succeed(
                  generateResponse(
                    buildSpeechletResponse("Sucessfully logged a " + type + " event", true),
                    {}
                  )
                )}
    else{context.succeed(
                  generateResponse(
                    buildSpeechletResponse("Failed to log the event, please check to see if that student is registered", true),
                    {}
                 ))}});
}
 

// Helpers
function buildSpeechletResponse(outputText, shouldEndSession) {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  };

}

function generateResponse(speechletResponse, sessionAttributes) {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };

}    
};

