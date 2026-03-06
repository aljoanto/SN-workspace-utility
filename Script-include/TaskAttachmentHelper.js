/**
 * Script Include: TaskAttachmentHelper
 * Retrieves attachments from Catalog Tasks associated with a Requested Item.
 */
var TaskAttachmentHelper = Class.create();

TaskAttachmentHelper.prototype = {

    /** Initialize Script Include */
    initialize: function() {},

    /**
     * Get attachments from tasks linked to a Requested Item.
     * @param {String} ritmSysId - sys_id of Requested Item
     * @returns {Object} response containing task presence and attachments
     */
    getTaskAttachments: function(ritmSysId) {

        /** Requested Item sys_id */
        var ritm_ID = ritmSysId;

        /** Response structure returned to REST API */
        var response = {
            hasTasks: false,
            attachments: []
        };

        /** Collect sys_ids of all tasks linked to the RITM */
        var taskIds = [];
        var taskGR = new GlideRecord('sc_task');

        /** Query Catalog Tasks associated with the Requested Item */
        taskGR.addEncodedQuery('request_item=' + ritm_ID);

        taskGR.query();
        while (taskGR.next()) {

            /** Store task sys_id for attachment lookup */
            taskIds.push(taskGR.getUniqueValue());
        }

        /** Mark if at least one task exists */
        if (taskIds.length > 0)
            response.hasTasks = true;

        /** Query attachments linked to the collected task records */
        var attachGR = new GlideRecord('sys_attachment');
        attachGR.addEncodedQuery('table_name=sc_task^table_sys_idIN' + taskIds.join(','));
        attachGR.query();

        while (attachGR.next()) {

            /** Push attachment metadata to response */
            response.attachments.push({
                sys_id: attachGR.getUniqueValue(),
                file_name: attachGR.file_name.toString(),
                content_type: attachGR.content_type.toString(),
                size_bytes: attachGR.size_bytes.toString(),
                download_link: '/sys_attachment.do?sys_id=' + attachGR.getUniqueValue()
            });
        }

        /** Return structured result to calling API */
        return response;
    },

    type: 'TaskAttachmentHelper'
};
