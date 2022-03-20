(async function GetTrainingData() {    
    var result = "";
    let intents = [{uid: "111", name: "greet"}, 
            {uid: "112", name: "goodbye"}, {uid: "113", name: "affirm"}, 
            {uid: "114", name: "deny"}, {uid: "115", name: "mood_great"}, 
            {uid: "117", name: "mood_unhappy"}, {uid: "116", name: "bot_challenge"}];

    let entities = [{uid: "1", name: "var_1"}];
    let slots = [{uid: "221", name: "var_1", type: "text", initial_value: "122", entity: "1"}]
    let actions = [{uid: "11", name: "action_hello_world"}];
    let intentExamples = [{sentence: "blah blah {{0}} blah blah", intent: 111, 
                            entity1: 1, entity1_val: "rasaa"}];
    let responses = [{uid: "311", name: "utter_greet", definition: {text: "", image: ""}}];
    let stories = [{uid: "1111", name: "Story1"}]
    let storySteps = [{uid: "11111", stepNumber: 1, userIntent: 112, customAction: true,
            botSimpleAction: "311", outputSlot: 221, story: 1111}]
    
    result = `${result}\nintents:\n`
    for(let intentIndx in intents) {
        let intent = intents[intentIndx];
        result = `${result}  - ${intent.name}\n`
    }
    result = `${result}\nactions:\n`
    for(let actionsIndx in actions) {
        let action = actions[actionsIndx];
        result = `${result}  - ${action.name}\n`
    }
    result = `${result}\nresponses:\n`
    for(let responseIndx in responses) {
        let response = responses[responseIndx];
        result = `${result}  ${response.name}\n`
        let responseDefinition = response.definition;
        responseDefinition = (typeof responseDefinition == "string")? JSON.parse(responseDefinition): responseDefinition;
        if(responseDefinition && Object.keys(responseDefinition).length > 0) {
            result = `${result}  -`;
            for(let responseDefinitionKeyIndx in Object.keys(responseDefinition)) {
                let responseDefinitionKey = Object.keys(responseDefinition)[responseDefinitionKeyIndx];
                result = `${result}${responseDefinitionKey}: "${responseDefinition[responseDefinitionKey]}"\n   `
            }
            result = `${result}\n`
        }
    }
    result = `${result}\nentities:\n`
    for(let entitiesIndx in entities) {
        let entity = entities[entitiesIndx];
        result = `${result}  - ${entity.name}\n`
    }
    result = `${result}\nslots:\n`
    for(let slotsIndx in slots) {
        let slot = slots[slotsIndx];
        result = `${result}  ${slot.name}:\n`
        result = `${result}     ${slot.type}:\n`
        result = `${result}     ${slot.initial_value}:\n`
        
        let matchingEntity = entities.filter((e)=>e.uid == slot.entity);
        if(matchingEntity && matchingEntity.length > 0) {
            result = `${result}     mappings:\n`
            result = `${result}       - type: from_entity:\n`
            result = `${result}         entity: ${matchingEntity[0].name}\n`
        }
    }
    result = `${result}\nsession_config:\n  session_expiration_time: 60\n  carry_over_slots_to_new_session: true`

    result = `${result}\nnlu:\n`
    for(let intentIndx in intents) {
        let intent = intents[intentIndx];
        result = `${result}- intent: ${intent.name}\n`;
        result = `${result}  examples:\n`;
        let intentExamplesForIntent = intentExamples.filter((e) => e.intent == intent.uid);
        for(let intentExampleIndx in intentExamplesForIntent) {
            let intentExample = intentExamplesForIntent[intentExampleIndx];
            let entity1Name = entities.filter((e)=>e.uid == intentExample.entity1); 
            entity1Name = entity1Name && entity1Name.length > 0? entity1Name[0].name: "";
            let entity2Name = entities.filter((e)=>e.uid == intentExample.entity2); 
            entity2Name = entity2Name && entity2Name.length > 0? entity2Name[0].name: "";
            let entity3Name = entities.filter((e)=>e.uid == intentExample.entity3); 
            entity3Name = entity3Name && entity3Name.length > 0? entity3Name[0].name: "";
            let entity4Name = entities.filter((e)=>e.uid == intentExample.entity4); 
            entity4Name = entity4Name && entity4Name.length > 0? entity4Name[0].name: "";
            let entity5Name = entities.filter((e)=>e.uid == intentExample.entity5); 
            entity5Name = entity5Name && entity5Name.length > 0? entity5Name[0].name: "";
            
            let example = intentExample.sentence
                            .replace("{{0}}", `[${intentExample.entity1_val}]{"entity": "${entity1Name}", "value": "${intentExample.entity1_val}"}`)
                            .replace("{{1}}", `[${intentExample.entity2_val}]{"entity": "${entity2Name}", "value": "${intentExample.entity2_val}"}`)
                            .replace("{{2}}", `[${intentExample.entity3_val}]{"entity": "${entity3Name}", "value": "${intentExample.entity3_val}"}`)
                            .replace("{{3}}", `[${intentExample.entity4_val}]{"entity": "${entity4Name}", "value": "${intentExample.entity4_val}"}`)
                            .replace("{{4}}", `[${intentExample.entity5_val}]{"entity": "${entity5Name}", "value": "${intentExample.entity5_val}"}`)

            result = `${result}    - ${example}:\n`;
        }
    }
    result = `${result}\nstories:\n`
    for(let storiesIndx in stories) {
        let story = stories[storiesIndx];
        result = `${result}- story: ${story.name}\n`;
        result = `${result}  steps:\n`;
        let storyStepsForStory = storySteps.filter((e) => e.story == story.uid);
        for(let storyStepsForStoryIndx in storyStepsForStory) {
            let storyStep = storyStepsForStory[storyStepsForStoryIndx];
            let userIntent = intents.filter((e) => e.uid == storyStep.userIntent);
            userIntent = userIntent[0];
            result = `${result}  - intent: ${userIntent.name}:\n`;
            if(`${storyStep.customAction}` == "true") {
                result = `${result}  - action: action_custom:\n`;
            }else {
                let simpleAction = responses.filter((e) => e.uid == storyStep.botSimpleAction);
                simpleAction = simpleAction[0];
                result = `${result}  - action: ${simpleAction.name}:\n`;
            }
        }
    }
    result = `${result}\nrecipe: default.v1\nlanguage: en\npipeline:\npolicies:\n\n`
    $resolve({result});                                   
})