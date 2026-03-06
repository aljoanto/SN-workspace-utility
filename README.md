# SN-workspace-utility
Workspace solution to view attachments from Catalog Tasks associated with a Requested Item

# ServiceNow Workspace – View Task Attachments

## Overview
This solution allows users to view attachments from Catalog Tasks associated with a Requested Item directly in Workspace.

## Components

Script Include  
TaskAttachmentHelper

Scripted REST API  
task_attachment_api

Workspace Declarative Action  
View Attachment button

## Architecture

Workspace Client Script  
↓  
Scripted REST API  
↓  
Script Include  
↓  
Catalog Tasks (sc_task)  
↓  
Attachments (sys_attachment)

## Version
Tested on ServiceNow Zurich
