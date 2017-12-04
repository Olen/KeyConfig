Components.utils.import("resource:///modules/mailServices.js");

goDoCommand('cmd_markAsNotJunk');
goDoCommand('cmd_removeTags');

var archiveFolderUri;
var archiveFolder;
var granularity;

var selectedMessages = gFolderDisplay.selectedMessages;

for(var i = 0; i < selectedMessages.length; i++) {
  // var msg = gFolderDisplay.selectedMessages[i];
  var msg = selectedMessages[i];
  var folder = msg.folder;

  if (folder.name.match(/INBOX/i)) {
    // alert("Move to archive");
    if (!identity) {
      var identity = getIdentityForHeader(msg);
      archiveFolderUri = identity.archiveFolder;
      archiveFolder = MailUtils.getFolderForURI(archiveFolderUri);

      granularity = identity.archiveGranularity;
      if (!archiveFolder.canCreateSubfolders) {
        granularity = identity.singleArchiveFolder;
      }
    }

    var msgDate = new Date(msg.date / 1000);
    var msgYear = msgDate.toLocaleFormat('%Y');
    var monthFolderName = msgDate.toLocaleFormat('%B');

    var archiveFolderUriFull = archiveFolderUri;
    if (granularity >= identity.perYearArchiveFolders) {
      archiveFolderUriFull += '/' + msgYear;
    }
    if (granularity >= identity.perMonthArchiveFolders) {
      archiveFolderUriFull += '/' + monthFolderName;
    }

    var msgs = Cc["@mozilla.org/array;1"].createInstance(Ci.nsIMutableArray);
    msgs.appendElement(msg, false);
    var isMove      = true;
    var copyService = MailServices.copy; // nsIMsgCopyService
    let srcFolder   = msg.folder;
    let destFolder  = MailUtils.getFolderForURI(archiveFolderUriFull);
    copyService.CopyMessages(srcFolder, msgs, destFolder, isMove, null, null, false);
  }
  else {
    // alert("Keep in " + folder.folderURL);
    var selectedIndex = gFolderDisplay.selectedIndices[0];
    gFolderDisplay.view.refresh();
    var rowCount = gDBView.rowCount;
    if (selectedIndex >= rowCount) {
      selectedIndex = rowCount - 1;
    }
    gFolderDisplay.selectViewIndex(selectedIndex);
  }
}


/*
goDoCommand('cmd_archive');
*/
