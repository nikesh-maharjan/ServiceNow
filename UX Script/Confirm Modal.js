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
    }
}