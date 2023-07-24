/**
* @param {params} params
* @param {api} params.api
* @param {any} params.event
* @param {any} params.imports
* @param {ApiHelpers} params.helpers
*/
function handler({api, event, helpers, imports}) {
    if (api.state.modalTitle === "Delete Comment?") {
        helpers.snHttp('/api/scope/apis/deleteComment', {
            method: 'PUT',
            body: {
                commentId: api.state.commentID
            }
        }).then(({response}) => {
           helpers.modal.close("custom_6");
           api.setState('refreshCommentList', {timestamp: Date.now()});
           // api.data.get_comment_repeater_1.refresh();
        }).catch(({error}) => {
            //console.log('error');
        });
    } else if (api.state.modalTitle === "Submit?") {
        if (!save()) {return;}
        helpers.snHttp('/api/scope/apis/submit', {
            method: 'PUT',
            body: {
                commentId: api.state.commentID
            }
        }).then(({response}) => {
           navPage("Details");
        }).catch(({error}) => {});
    }

    function save () {
        var isSaveSuccessfull = false;
        var formVals = api.data.glide_form_1.nowRecordFormBlob.fields;
        var missingFieldArr = [];
        for (var i in formVals) {
            if (formVals[i].mandatory == true && (formVals[i].value == '' || formVals[i].value == null)) {
                missingFieldArr.push(formVals[i].label);
            }
        }

        if (missingFieldArr.length > 0) {
            addErrorMessage("The following required fields are missing. "+ missingFieldArr.join());
        } else {
            isSaveSuccessfull = true;
        }
        api.data.glide_form_1.save();
        return isSaveSuccessfull;
    }

    function navPage(page) {
        var date = new Date().getTime();
        helpers.navigate.to('pageId', {
            'sysId': api.context.props.sysId,
            'currDate': date
        }, {}, true);
    }

    function addErrorMessage(msg) {
        api.emit("NOW_UXF_PAGE#ADD_NOTIFICATIONS", {
            items: [{
                id: "alert1",
                status: "critical",
                icon: "triangle-exclamation-outline",
                content: {
                    type: "string",
                    value: msg
                },
                action: {
                    type: "dismiss"
                },
            }]
        });
    }
}