/**
 * Declarative Action Client Script
 * Fetches attachments from tasks linked to the current RITM
 * and displays them in a modal.
 */
async function onClick() {

    /** Get current Requested Item sys_id */
    const ritmID = g_form.getUniqueValue();

    const apiEndPoint = '/api/x_1631815_worksp_0/task_attachment_api/get_attachments';

    /** Call Scripted REST API to retrieve task attachments */
    const response = await fetch(apiEndPoint + '?ritm_sys_id=' + ritmID);

    /** Handle REST API failure and notify user */
    if (!response.ok) {
        g_modal.richText('Error', '<p>Unable to retrieve attachments.</p>');
        return;
    }

    /** Parse API response */
    const data = await response.json();

    if (!data || !data.result) {
        g_modal.richText('Error', '<p>Invalid response received.</p>');
        return;
    }

    /** HTML content to render inside modal */
    let content = '';

    /** Show message if no tasks exist for the RITM */
    if (!(data.result.hasTasks)) {
        content += '<p>No associated tasks found.</p>';

        /** Show message if tasks exist but have no attachments */
    } else if (data.result.attachments.length === 0) {
        content += '<p>No attachments found on associated tasks.</p>';

    } else {

        /** Build attachments table */
        content += `<table style="width:100%;max-height:400px border-collapse:collapse;"><thead>
        <tr style="background:#f4f6f8;">
        <th style="padding:8px; text-align:left;">File Name</th>
        <th style="padding:8px; text-align:left;">Content Type</th>
        <th style="padding:8px; text-align:left;">File Size</th>
        <th style="padding:8px; text-align:left;">Download</th>
        </tr></thead>
        <tbody>`;

        /** Populate rows for each attachment */
        data.result.attachments.forEach(att => {

            /** Convert size from bytes to MB */
            const fileSize = (att.size_bytes / (1024 * 1024)).toFixed(2);

            content += `<tr><td style="padding:8px;"> ${att.file_name}</td>
            <td style="padding:8px;"> ${att.content_type}</td>
            <td style="padding:8px;">${fileSize}</td>
            <td style="padding:8px;">
                    <a href="${att.download_link}" target="_blank">
                        ${att.file_name}
                    </a>
                </td>
                </tr>
            `;
        });

        content += '</tbody></table>';
    }

    /** Render results in Workspace modal */
    g_modal.richText('Task Attachments', content, function(action_verb) {}, {
        size: 'lg',
    });
}
