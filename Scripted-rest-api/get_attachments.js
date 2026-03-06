/**
 * Scripted REST API Resource: Get Attachments for Requested Item Tasks
 *
 * Purpose:
 * This REST API endpoint retrieves attachments from all Catalog Tasks (sc_task)
 * associated with a given Requested Item (RITM).
 *
 * How it works:
 * 1. Accepts a Requested Item sys_id (ritm_sys_id) as a query parameter.
 * 2. Validates that the parameter is provided.
 * 3. Calls the Script Include 'TaskAttachmentHelper' to fetch attachments
 *    from tasks linked to the specified RITM.
 * 4. Returns a structured response containing task presence and attachment details.
 * 5. Handles invalid input and unexpected errors with appropriate HTTP status codes.
 *
 * Inputs:
 * - request.queryParams.ritm_sys_id (String)
 *   The sys_id of the Requested Item whose task attachments need to be retrieved.
 *
 * Outputs:
 * - Success Response (200):
 *   Object returned from TaskAttachmentHelper containing:
 *     - hasTasks (Boolean): Indicates if associated tasks exist
 *     - attachments (Array): List of attachment metadata
 *
 * - Error Responses:
 *     - 400: Missing ritm_sys_id parameter
 *     - 500: Unexpected server-side error
 *
 * Notes:
 * - Designed for use by ServiceNow Workspace client scripts via fetch API.
 * - Authentication and role restrictions should be enforced at the Scripted REST API level.
 */

(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    try {

        // Extract the RITM sys_id from query parameters.
        // Ensures the value is treated as a string and trims any accidental whitespace.
        var ritmSysId = (request.queryParams.ritm_sys_id || '').toString().trim();

        // Validate input parameter.
        // If ritm_sys_id is not provided, return HTTP 400 (Bad Request).
        if (!ritmSysId) {
            response.setStatus(400);
            return {
                error: "ritm_sys_id is required"
            };
        }

        // Instantiate the helper class responsible for retrieving
        // task-related attachment information.
        var helper = new TaskAttachmentHelper();

        // Delegate the core logic to the Script Include.
        // This keeps the REST resource lightweight and focused on request handling.
        return helper.getTaskAttachments(ritmSysId);

    } catch (e) {

        // Catch any unexpected server-side errors to prevent
        // internal exception details from being exposed to the client.
        response.setStatus(500);

        return {
            error: "Unexpected server error"
        };
    }

})(request, response);
