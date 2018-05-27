<?php
// --------------------------------------------------------------------------------------------------//
// VERSION: 0.06
// --------------------------------------------------------------------------------------------------//
// Start of the class library section of this code
// The actual running part of this script may be found at the very bottom of this file.
// 
// The primary class of interest is phpRequestExecutor.  Please see each of the methods in this 
// class for a desciption of the recommended interface.
//
//   General Design Notes:
//   This script contains the class: phpRequestExecutor.
//   phpRequestExecutor is provided solely as an example implementation of a server-side HTTP-filing 
//   interface.  As such, Xerox does not make any representations, extend any warranties of any kind, 
//   either expressed or implied, or assumes any responsibilities whatever with respect to this script. 
//   Please pay particular note to the script comments relating to script exploits. All server-side 
//   scripts present the opportunity for misuse and Xerox shall be in no way responsible for any misuse 
//   of this script.
//   This script is presently written to support PHP 4.3.x. It could be greatly improved for PHP 5.x
//   by providing access specifiers to the class attributes and methods.  The following comment is
//   specifically provided for such a PHP 5.x specific script.
//   This script does not use global or public constants.  This is to prevent the exploitation
//   of the constants in the event that the script is included by a malicious script.
//   Whenever a constant is used in a conditional expression, this script places the constant
//   on the left-hand side of the expression.  This is to provided consistency with scripts
//   written in languages which support inadvertent assignment instead of evaluation.  For
//   example, "if(a = 100)" can evaulate very differently than "if(100 == a)".  In the latter
//   case, if the expression was "if(100 = a)" and the languauge supports assignment in
//   conditionals, this will result in an error instead of returning "true" when the assignment
//   is complete.
//

// Defines for cross-script "likeness"
// Use of define in this case is OK as we're not putting anything dangerous out there publically.
define("VBLF", "\n");
define("EMPTY_STRING", "");
define("BYTES_TO_READ", 8192);
define("SLASH_STRING", "/"); // PHP "DIRECTORY_SEPARATOR" is not c-string friendly
define("RECURSION_MAX_DEPTH", 5);
define("RETURN_NULL", "");
define("RETURN_ERROR", "XRXERROR");
define("RETURN_NOTFOUND", "XRXNOTFOUND");
define("RETURN_BADNAME", "XRXBADNAME");
define("RETURN_DIREXISTS", "XRXDIREXISTS");

//=========================================================//
//	class phpRequestExecutor provides the interfaces 	  //
//	for handling a requested operation.				      //
//=========================================================//
// 
// class hierarchy in extended Schlarr-Mellor notation is:
//   phpRequestExecutor
//
//   class Description:
//   This class provides the interfaces for DeleteFile, GetFile, PutFile, MakeDir, RemoveDir, 
//   and DeleteDirContents  These interfaces are documented with their declarations.
//
class phpRequestExecutor
{
	// Private class attributes which we've use as constants to make it easier to synchronize their
	// data with the device code easier.  These attributes represent the "name" of the form 
	// variable in the request stream from the device.
		// Remember to make sure that these are in synch with the device code.
	var $att_constFormVarNameTheOperation = "theOperation";
	var $att_constFormVarNameDestinationName = "destName";
	var $att_constFormVarNameDestinationDirectory = "destDir";
	var $att_constFormVarNameDeleteDirectory = "delDir";
	var $att_constFormVarNameUploadedFile = "sendfile";
	// Max acceptable fully qualified path
		// Max path has been arbitrarily set to 64k, basically to prevent someone from
		// sending us a zillion bytes and { crashing us because we try to use them.
	var $att_constMaxPath = 65536;
	// Track how deep we get when recursing into directories.  If we exceed our max depth,
	// something is wrong.
	var $att_currentRecursionDepth = 0;

	// class initializer.  Make sure we've set all of our attributes to the initial values.
	function phpRequestExecutor()
	{
	}

	// Method: phpRequestExecutor::Run
	// This is the callable method of this class.  It performs the actual work of 
	// responding to the form data in the request stream from the device.
	// Expected Form Variables submitted from a device:
	//   theOperation: the name of the operation to perform
	// Expected Behavior:
	//   The Run method will call a specific method depending on the operation
	//   requested in the form variable "theOperation".
	// Expected Return:
	//   If successful, nothing.
	//   XRXERROR if "theOperation" isn't supported.
	// Script Exploit Opportunities:
	//   As this function will delegate any real activity to other methods, it//s primary
	//   responsibility is to only call the other methods on explicit cases of "the operation"
	//   as specified in the incoming form variables.
	// Not Supported:
	//   At present, it is understood that retrieving the script version is not support.
	//   As such, it is not supported by this script.
	function Run()
	{
		// Get the thing that we want to do from the form variables in the request stream
		$strTheOperation = $this->GetFormVar($this->att_constFormVarNameTheOperation);
		// and then call the appropriate method to do it.
		if ("DeleteFile" == $strTheOperation) 
			$this->DeleteFile();
		elseif ("MakeDir" == $strTheOperation) 
			$this->MakeDirectory();
		elseif ("RemoveDir" == $strTheOperation) 
			$this->RemoveDirectory();
		elseif ("DeleteDirContents" == $strTheOperation) 
			$this->DeleteDirectoryContents();
		elseif ("GetFile" == $strTheOperation) 
			$this->GetFile();
		elseif ("PutFile" == $strTheOperation) 
			$this->SaveFiles();
		elseif ("ListDir" == $strTheOperation) 
			$this->ListDirectory();
		else
			echo RETURN_ERROR;
		// Do nothing except return an error code if the operation isn't one of the above cases.  
		// This narrows the scope of exploit attempts that can be made using the operation as the 
		// entry point.
		// phpRequestExecutor::Run is done.
	}

	// Method: phpRequestExecutor::DeleteFile
	// This private method will delete a specific file on the server.
	// Expected Form Variables submitted from a device:
	//   destName: the name of the file to delete, without path information
	//   destDir: the fully qualified file system path of the file to delete,
	//     a slash is optional
	// Expected Behavior:
	//   The delete method will delete the file specified in the form variables
	//   of the request stream.  
	// Expected Return:
	//   If successful, nothing.
	//   XRXBADNAME if the requested file isn't of the correct type or the name is empty.
	//   XRXNOTFOUND if the requested file isn't found. 
	//   XRXERROR the file cannot be deleted.
	// Script Exploit Opportunities:
	//   The delete file operation could be used to delete any file on the system provided
	//   that the running web process has sufficient rights to delete the file.  Since this
	//   places the responsibility of insuring that the web process does not have rights to
	//   delete files it shouldn//t be onto the server configuration and that we cannot assume 
	//   that only our files need to be deleted on any given web server, we're going to limit 
	//   the extensions (type) of files that this function will be able to delete.  This way, 
	//   the script cannot be used to delete any file which the web process has rights to delete.
	function DeleteFile()
	{
		// Get us a return state
		$strReturn = RETURN_NULL;
		// Get the path of the file to delete from the form variables in the request stream.
		$strPathName = $this->GetFormVar($this->att_constFormVarNameDestinationDirectory);
		// Get the name of the file to delete from the form variables in the request stream.
		$strTargetName = $this->GetFormVar($this->att_constFormVarNameDestinationName);
		// Make sure that the file is one of the types we allow to be deleted
		if ($this->CheckFileExtension($strTargetName))
		{
			// Build the fully qualified target path using the directory and the file name.
			$strFileName = $this->BuildFullyQualifiedPath($strPathName, $strTargetName);
			// Make sure we have a meaningful file name to delete.
			if (EMPTY_STRING != $strFileName) 
			{
				// Make sure that the files exists
				if(file_exists($strFileName))
				{
					// Then delete it
					if(!unlink($strFileName))
						// Delete failed, return an error
						$strReturn = RETURN_ERROR;
				}
				else
				{
					// File doesn't exist, return an error
					$strReturn = RETURN_NOTFOUND;
				}
			}
		}
		else
		{
			// The name is bad, return an error
			$strReturn = RETURN_BADNAME;
		}
		// See if we should send an error back
		if(RETURN_NULL != $strReturn)
			echo $strReturn;
		// phpRequestExecutor::DeleteFile is done.
	}

	// Method: phpRequestExecutor::GetFile
	// This private method will return the contents of the specified file as text
	// the repsonse stream.  To prevent this function being exploited and used to
	// list the contents of potentially any text-based file accessible to the server,
	// this function only returns the contents of files with the xst, dat extensions.
	// Expected Form Variables submitted from a device:
	//   destDir: the fully qualified file system path of the file to return
	//   destName: the name of the file to return
	// Expected Behavior:
	//   The get file method will return the contents the file specified 
	//   in the form variables of the request stream.  
	// Expected Return:
	//   If successful, return the contents of the file in the response stream.
	//   XRXBADNAME if the requested file isn't of the correct type or the name is empty.
	//   XRXNOTFOUND if the requested file isn't found.
	//   XRXERROR the file cannot be read.
	// Script Exploit Opportunities:
	//   The get file operation could be used to retrieve the contents any text file on the 
	//   system provided that the running web process has sufficient rights to access the file.  
	//   Since this places the responsibility of insuring that the web process does not have 
	//   rights to read files which it shouldn//t be able to onto the server configuration and 
	//   that we cannot assume that only our files should be readable on any given web server, 
	//   we're going to limit the extensions (type) of files that this function will be able to
	//   read. This way, the script cannot be used to retrieve the contents of any file which 
	//   the web process has rights to access.
	//   Another attacker could use this function to launch a denial of service attack if the
	//   script were to use the ReadAll function to retrieve the contents of the requested file.
	//   See below for additional details on why not use ReadAll.
	function GetFile()
	{
		// Get us a return state
		$strReturn = RETURN_NULL;
		// Get the path of the file to retrieve from the form variables in the request stream.
		$strPathName = $this->GetFormVar($this->att_constFormVarNameDestinationDirectory);
		// Get the name of the file to retrieve from the form variables in the request stream.
		$strTargetName = $this->GetFormVar($this->att_constFormVarNameDestinationName);
		// Make sure that the file is one of the types we allow to be retrieved
		if ($this->CheckFileExtension($strTargetName))
		{
			// Build the fully qualified target path using the directory and the file name.
			$strFileName = $this->BuildFullyQualifiedPath($strPathName, $strTargetName);
			// Make sure we have a meaningful file name to retrieve.
			if (EMPTY_STRING != $strFileName) 
			{
				// Make sure that we actually have something to get.
				if(file_exists($strFileName))
				{
					// Since we're only reading text files, just use the "r" option to open the file
					$handleFile = @fopen("$strFileName", "r");
					if(false !== $handleFile)
					{
						// While we've got data to read
						while (!feof($handleFile)) 
						{
							// Read it, but only read a certain size block of data at a time.
							// If the script were to read the whole file at once, the script
							// could be used to launch a sort of denial of service (DOS) attack.
							// The DOS attack could be accomplished by uploading a large enough 
							// file which the script is allowed to read (like an .xst) and 
							// sending lots of requests for the script to read it.  If we read
							// the whole file into memory at once, we could very quickly run
							// out of memory in this case.
							echo fread($handleFile, BYTES_TO_READ);
						}
						// Make sure we close the file reader.
						fclose($handleFile);
					}
					else
					{
						// We couldn't open the file, return an error
						$strReturn = RETURN_ERROR;
					}
				}
				else
				{
					// The file wasn't found, return an error
					$strReturn = RETURN_NOTFOUND;
				}
			}
			else
			{
				// The name is empty, return an error
				$strReturn = RETURN_BADNAME;
			}
		}
		else
		{
			// The name is bad, return an error
			$strReturn = RETURN_BADNAME;
		}
		// See if we should send an error back
		if(RETURN_NULL != $strReturn)
			echo $strReturn;
		// phpRequestExecutor::GetFile is done.
	}

	// Method: phpRequestExecutor::MakeDirectory
	// This private method will create a directory on the server.
	// Expected Form Variables submitted from a device:
	//   destDir: the fully qualified file system path of the directory to create
	// Expected Behavior:
	//   The make directory method will create the directory specified in the form variables
	//   of the request stream.  
	// Expected Return:
	//   If successful, nothing.
	//   XRXBADNAME if the name is empty.
	//   XRXDIREXISTS if the directory already exists.
	//   XRXERROR if the directory cannot be created.
	// Script Exploit Opportunities:
	//   This function could be used to create enough directories to exceed the file system's
	//   limits.  This script does not prevent this.
	function MakeDirectory()
	{
		// Get us a return state
		$strReturn = RETURN_NULL;
		// Get the name of the directory to create from the form variables in the request stream.
		$strDirectoryName = $this->GetFormVar($this->att_constFormVarNameDestinationDirectory);
		// Make sure we have a meaningful directory name to create.  Please note that this function
		// allows a directory of any name to be created.
		if ($this->PrepDirectoryName($strDirectoryName))
		{
			// Let's make sure the directory isn't already there.
			if (!(file_exists($strDirectoryName)))
			{
				// If it's not, then we should probably create it since that's what we were
				// asked to do.
				if(!mkdir($strDirectoryName))
					// Couldn't create the directory, return an error
					$strReturn = RETURN_ERROR;
			}
			else
			{
				// Directory already exists, return an error
				$strReturn = RETURN_DIREXISTS;
			}
		}
		else
		{
			// The name is bad, return an error
			$strReturn = RETURN_BADNAME;
		}
		// See if we should send an error back
		if(RETURN_NULL != $strReturn)
			echo $strReturn;
		// phpRequestExecutor::MakeDirectory is done.
	}

	// Method: phpRequestExecutor::RemoveDirectory
	// This private method will remove a directory on the server.  The directory must end in
	// xsm, lck.  This minimizes the script from being exploited to delete unprotected areas of
	// the file system.
	// Expected Form Variables submitted from a device:
	//   destDir: the fully qualified file system path of the directory to remove.
	// Expected Behavior:
	//   The remove directory method will remove the directory specified in the form variables
	//   of the request stream.  
	// Expected Return:
	//   If successful, nothing
	//   XRXBADNAME if the requested directory isn't of the correct type or the name is empty.
	//   XRXNOTFOUND if the directory does not exist.
	//   XRXERROR if the directory cannot be deleted.
	// Script Exploit Opportunities:
	//   The remove directory operation could be used to remove any folder on the system provided
	//   that the running web process has sufficient rights to remove the folder.  Since this
	//   places the responsibility of insuring that the web process does not have rights to
	//   remove folders it shouldn//t be onto the server configuration and that we cannot assume 
	//   that only our folders need to be removed on any given web server, we're going to limit 
	//   the extensions (type) of folders that this function will be able to delete.  This way, 
	//   the script cannot be used to remove any folder which the web process has rights to remove.
	function RemoveDirectory()
	{
		// Get us a return state
		$strReturn = RETURN_NULL;
		// Get the name of the directory to remove from the form variables in the request stream.
		$strDirectoryName = $this->GetFormVar($this->att_constFormVarNameDestinationDirectory);
		// Make sure that the directory ends in the agreed upon directory name ending convention.
		// This prevents this function from being used maliciously against the HTTP server.
		if ($this->CheckDirectoryExtension($strDirectoryName))
		{
			// Let's make sure the directory exists in the first place
			if (is_dir($strDirectoryName))
			{
				// then remove the directory.  Note that this requires the directory to be empty.
				if(!rmdir($strDirectoryName))
					// We couldn't remove the directory, return an error
					$strReturn = RETURN_ERROR;
			}
			else
			{
				// This isn't a directory, return an error
				$strReturn = RETURN_BADNAME;
			}
		}
		else
		{
			// The name is bad, return an error
			$strReturn = RETURN_BADNAME;
		}
		// See if we should send an error back
		if(RETURN_NULL != $strReturn)
			echo $strReturn;
		// phpRequestExecutor::RemoveDirectory is done.
	}

	// Method: phpRequestExecutor::DeleteDirectoryContents
	// This private method will remove a directory and all of its subdirectories and files 
	// on the server.  The directory must end in ".lck".  This minimizes the script from 
	// being exploited to delete unprotected areas of the file system.
	// Expected Form Variables submitted from a device:
	//   deleteDir: Zero to remove the directory also, One to keep the directory.
	//   destDir: the fully qualified file system path of the directory to remove
	// Expected Behavior:
	//   The delete directory contents method will delete the directory and all of its
	//   files and subdirectories specified in the form variables.
	//   of the request stream.  
	// Expected Return:
	//   If successful, nothing
	//   XRXBADNAME if the requested directory isn't of the correct type or the name is empty.
	//   XRXNOTFOUND if the directory does not exist.
	//   XRXERROR if the directory (or some of its files) cannot be deleted.
	// Not Supported:
	//   At present, the form variable "isRecursive" is not supported. The device team//s test 
	//   HTML form contains this variable, but it is not used by the existing server-side script. 
	//   As such, it is not supported in this script.
	// Script Exploit Opportunities:
	//   The delete directory contents operation could be used to remove any folder and contained
	//   subfolders and files on the system provided that the running web process has sufficient 
	//   rights to remove the folder.  Since this places the responsibility of insuring that the 
	//   web process does not have rights to remove folders and delete files onto the server 
	//   configuration and that we cannot assume that only our folders need to be removed on any 
	//   given web server, we're going to limit the extensions (type) of folders that this function 
	//   will be able to delete.  This way, the script cannot be used to remove any folder which the 
	//   web process has rights to remove.
	function DeleteDirectoryContents()
	{
		// Get us a return state
		$strReturn = RETURN_NULL;
		// Get the name of the directory in which to delete all of the files from the form 
		// variables in the request stream.
		$strDirectoryName =$this->GetFormVar($this->att_constFormVarNameDestinationDirectory);
		// Get whether of not to also delete the directory from the form variables 
		// in the request stream.
		$bAlsoDeleteDirectory = $this->GetFormVar($this->att_constFormVarNameDeleteDirectory);
		// Make sure that the directory ends in the agreed upon directory name ending convention.
		// This prevents this function from being used maliciously against the HTTP server.
		if ($this->CheckDirectoryExtension($strDirectoryName))
		{
			// Let's make sure that the directory exists in the first place.
			if (file_exists($strDirectoryName))
			{
				// Strip off the trailing slash... this is important for the list we're going to build
				$strDirectoryName = substr($strDirectoryName, 0, strlen($strDirectoryName) - 1);
				// We're going to use a non-recursive method of walking the directory
				// hierarchy which will give us a list of all of the files and all
				// of the directories.
				// This will hold all of our files
				$arrFiles = '';
				// This will hold all of our directories
				$arrDirectories = '';
				// The stack is a placeholder for where we are.
				$stack[] = $strDirectoryName;
				while ($stack) 
				{
					$current_dir = array_pop($stack);
					// Open the directory for reading
					if ($dh = @opendir($current_dir)) 
					{
						// While there are entries to be read
						while (false !== ($file = readdir($dh))) 
						{
							// Make sure they are interesting
							if (('.' !== $file) && ('..' !== $file) )
							{
								$current_file = "{$current_dir}/{$file}";
								// If it's a file
								if (is_file($current_file)) 
								{
									// then add it to the list of files
									$arrFiles[] = "{$current_file}";
								} 
								// If it's a directory
								elseif (is_dir($current_file)) 
								{
									// then add it to the list of directories
									$arrDirectories[] = "{$current_file}/";
									// Update where we are
									$stack[] = $current_file;
								}
							}
						}
						closedir($dh);
					}
					else
					{
						// We can't read this directory, flag an error and break the loop
						$strReturn = RETURN_ERROR;
						break;
					}
				}
				// Let's make sure we didn't have any problems above before we go deleting things
				if(RETURN_NULL == $strReturn)
				{
					// Make sure that we have files to delete
					if(is_array($arrFiles))
					{
						foreach($arrFiles as $delfile)
						{
							// Delete the file
							unlink($delfile);
						}
					}
					// Make sure that we have directories to remove
					if(is_array($arrDirectories))
					{
						// Reverse the list so that we emtpy the directoies first.
						$arrDirectories = array_reverse($arrDirectories);
						foreach($arrDirectories as $deldirectory)
						{
							// Remove the directories found
							rmdir($deldirectory);
						}
					}
					// If we were asked to also delete the starting directory
					if ("1" == $bAlsoDeleteDirectory)
					{
							// Remove the starting directory
							if(!rmdir($strDirectoryName.SLASH_STRING))
								// We couldn't remove the directory, return an error
								$strReturn = RETURN_ERROR;
					}
				}
			}
			else
			{
				// The directory doesn't seem to exist, return an error
				$strReturn = RETURN_NOTFOUND;
			}
		}
		else
		{
			// The name is bad, return an error
			$strReturn = RETURN_BADNAME;
		}
		// See if we should send an error back
		if(RETURN_NULL != $strReturn)
			echo $strReturn;
		// phpRequestExecutor::DeleteDirectoryContents is done.
	}
	
	// Method: phpRequestExecutor::ListDirectory
	// This private method will list all of the files in a directory specified in 
	// the form variables in the request stream.  It will also lists any sub directories,
	// but not the files in the sub directories or their sub directories.
	// Expected Form Variables submitted from a device:
	//   destDir: the fully qualified file system path of the directory to list
	// Expected Behavior:
	//   The list directory method will enumerate the contents of the directory specified 
	//   in the form variables of the request stream.  
	// Expected Return:
	//   Nothing if no contents are found.  Otherwise it returns a line-feed (ASCII 10)
	//   delimited list of files and subdirectories.  Subdirectories are noted by appending
	//   the forward slash ("/") character to the end of the subdirectory's name.
	//   Otherwise: XRXBADNAME if the requested directory name is empty.
	//   XRXNOTFOUND if the directory does not exist.
	//   XRXERROR if the directory cannot be read.
	// Script Exploit Opportunities:
	//   This function could be used to determine the name of the files within a directory
	//   and use those names for malicious purposes like deleting files.  As this script
	//   limits activities like deleting files and dirctories, the only risk is that another
	//   script is used to perform the malicious activities. This script does not prevent that.
	function ListDirectory()
	{
		// Get us a return state
		$strReturn = RETURN_NULL;
		// Get the name of the directory to list from the form variables in the request stream.
		$strDirectoryName = $this->GetFormVar($this->att_constFormVarNameDestinationDirectory);
		// Make sure we have a meaningful directory name to list.
		if ($this->PrepDirectoryName($strDirectoryName))
		{
			// Hey, is this really a directory?
			if (is_dir($strDirectoryName)) 
			{
				// Let's open it
				if ($handleDir = @opendir($strDirectoryName)) 
				{
			   		// And get all of it's content
					while (false != ($file = readdir($handleDir))) 
					{
						// We don't want "." or ".."
						if(("." != $file) && (".." != $file))
						{
							// If it's a file
							if(is_file($file))
								// Add ASCII 10
								echo $file.VBLF;
							elseif(is_dir($file)) 
							// If it's a directory, add a forward slash and ASCII 10
								echo $file."/".VBLF;
							else
								// Add ASCII 10
								echo $file.VBLF;
						}
					}
					// Remember to close the directory reader
					closedir($handleDir);
				}
				else
				{
					// We couldn't open the directory, return an error
					$strReturn = RETURN_ERROR;
				}
			}
			else
			{
				// This isn't a directory, return an error
				$strReturn = RETURN_BADNAME;
			}
		}
		else
		{
			// The name is bad, return an error
			$strReturn = RETURN_BADNAME;
		}
		// See if we should send an error back
		if(RETURN_NULL != $strReturn)
			echo $strReturn;
		// phpRequestExecutor::ListDirectory is done.
	}

	// Method: phpRequestExecutor::SaveFiles
	// This private method will save all of the files post as multi-part form data into 
	// the directory specified in the form variables of the request stream.
	// Expected Form Variables submitted from a device:
	//   destName: the name of the file to delete, without path information.
	//   destDir: the fully qualified file system path of the directory to list
	// Expected Behavior:
	//   The save file method will save the files found in the request to the directory
	//   specified in the request stream.
	//   Note: if accessing this page annonymously, the internet guest account must have
	//   write permission to the path.
	// Expected Return:
	//   If successful, nothing.
	//   XRXBADNAME if the file name is empty.
	//   XRXERROR if the file cannot be written.
	// Script Exploit Opportunities:
	//   The save files operation could be used to upload malicious scripts to the server.
	//   Once uploaded, if the server has execute permission of these scripts, a user can
	//   effectively, remotely invoke the malicious code. The easiest solution to prevent this
	//   would be to remove execute permissions to the files this function writes.  This however
	//   does not apply to Windows-based file systems.  The other alternative would be limit
	//   the types of files this function uploads.  However, doing so would greatly limit this
	//   scripts ability to handle new uploads.  As lack of extensibility is greater than the
	//   risk of the use of this function to upload malicious scripts, this function does not
	//   prevent the upload of potentially malicious scripts.
	function SaveFiles()
	{
		// Get us a return state
		$strReturn = RETURN_NULL;
		// Get the path to save to from the form variables in the request stream.
		$strPathName = $this->GetFormVar($this->att_constFormVarNameDestinationDirectory);
		// Get the name of the directory to save the files in from the form variables
		// in the request stream.
		$strDestinationName = $this->GetFormVar($this->att_constFormVarNameDestinationName);
		// Make sure we have an uploaded file
		if (isset($_FILES[$this->att_constFormVarNameUploadedFile])) 
		{
			$strFileName = $this->BuildFullyQualifiedPath($strPathName, $strDestinationName);
			// Make sure we have a meaningful location to save to.
			if(EMPTY_STRING != $strFileName )
			{
				// Use the move uploaded file function because it checks that the file is where
				// it should be and it cleans up the temporary storage when done.
				if(!move_uploaded_file($_FILES[$this->att_constFormVarNameUploadedFile]['tmp_name'], $strFileName))
				// Something went wrong, return an error
				$strReturn = RETURN_ERROR;
			}
			else
			{
				// The name is bad, return an error
				$strReturn = RETURN_BADNAME;
			}
		}
		else
		{
			// The name is bad, return an error
			$strReturn = RETURN_BADNAME;
		}
		// See if we should send an error back
		if(RETURN_NULL != $strReturn)
			echo $strReturn;
		// phpRequestExecutor::SaveFiles is done.
	}

	// Method: phpRequestExecutor::CheckFileExtension
	// Internal Helper Only
	// To help with processing time of the script, the construction of the file name extensions
	// to check and the check itself have been encapsulated into this function.  This way, the
	// work is only done when the function is called.  Please note that the function is not
	// presently called more than once per any form post.  That enables the payoff of this 
	// strategy.
	// This function is essentially the same as phpRequestExecutor::CheckDirectoryExtension
	// and could make use of a third function to remove the duplicated code.  At present, it
	// remains as is in the event that files and directories are determined to require differing
	// checks.
	function CheckFileExtension($arg_fileName)
	{
		// Initialize our returning value to false which signifies that we didn//t find a match
		$bCheckFileExtension = false;
		// Get us a collection to store the list of valid types
		$arrList = array();

		// Make sure we have something to check
		if ((EMPTY_STRING != $arg_fileName) && ($this->att_constMaxPath >= strlen($arg_fileName)))
		{
			// Setup up the list of extensions to test against
			array_push($arrList, ".xst");
			array_push($arrList, ".dat");
			array_push($arrList, ".txt");

			// See if any of the extensions match the requested file name
			foreach($arrList as $strExtension)
			{
				// Get the extenstion part of the string
				$iLastPos = strrpos($arg_fileName, ".");
				$strTester = substr($arg_fileName, $iLastPos, strlen($strExtension));
				// if the extensions match (use case insensitive comparison)
				if (0 == strcasecmp($strExtension, $strTester))
				{
					// then set our returning value to true which signifies we found a match
					$bCheckFileExtension = true;
					return true; //iCounter = objList.Count + 1;
				}
			}
		}
		return $bCheckFileExtension;
		// phpRequestExecutor::CheckFileExtension is done.
	}

	// Method: phpRequestExecutor::CheckDirectoryExtension
	// Internal Helper Only
	// To help with processing time of the script, the construction of the directory name extensions
	// to check and the check itself have been encapsulated into this function.  This way, the
	// work is only done when the function is called.  Please note that the function is not
	// presently called more than once per any form post.  That enables the payoff of this 
	// strategy.
	// This function is essentially the same as phpRequestExecutor::CheckFileExtension
	// and could make use of a third function to remove the duplicated code.  At present, it
	// remains as is in the event that files and directories are determined to require differing
	// checks.
	function CheckDirectoryExtension(&$arg_dirName)
	{
		// Initialize our returning value to false which signifies that we didn//t find a match
		$bCheckDirectoryExtension = false;
		// Get us a collection to store the list of valid types
		$arrList = array();

		// Make sure we have something to check
		if ($this->PrepDirectoryName($arg_dirName))
		{
			// Setup up the list of extensions to test against
			// Note the trailing slash on the directory's name.
			array_push($arrList, ".lck".SLASH_STRING);
			array_push($arrList, ".xsm".SLASH_STRING);

			// See if any of the extensions match the requested file name
			foreach($arrList as $strExtension)
			{
				// Get the extenstion part of the string
				$iLastPos = strrpos($arg_dirName, ".");
				$strTester = substr($arg_dirName, $iLastPos, strlen($strExtension));
				// if the extensions match (use case insensitive comparison)
				if (0 == strcasecmp($strExtension, $strTester))
				{
					// then set our returning value to true which signifies we found a match
					$bCheckFileExtension = true;
					return true; //iCounter = objList.Count + 1;
				}
			}
		}
		return $bCheckDirectoryExtension;
		// phpRequestExecutor::CheckDirectoryExtension is done.
	}

	// Method: phpRequestExecutor::BuildFullyQualifiedPath
	// Internal Helper Only
	// This function ensures that there is a slash on the end of the path before appending
	// the file name onto it.
	function  BuildFullyQualifiedPath($arg_dirName, $arg_fileName)
	{
		// Initialize our returning value to an empty string in case we get garbage
		$strBuildFullyQualifiedPath = EMPTY_STRING;
		// Make sure we have a directory and a file name to work with
		if ((EMPTY_STRING != $arg_dirName) && ($this->att_constMaxPath >= strlen($arg_dirName)) 
			&& (EMPTY_STRING != $arg_fileName) && ($this->att_constMaxPath >= strlen($arg_fileName)))
		{
			// Be nice and add the slash in just in case it was omitted. 
			// (No need to worry about direction of the slash, just deal with a missing one.)
			$strSlash = $arg_dirName[strlen($arg_dirName)-1];
			if (("/" == $strSlash) || ("\\" == $strSlash))
				$strBuildFullyQualifiedPath = $arg_dirName.$arg_fileName;
			Else
				$strBuildFullyQualifiedPath = $arg_dirName.SLASH_STRING.$arg_fileName;
		}
		return $strBuildFullyQualifiedPath;
		// phpRequestExecutor::BuildFullyQualifiedPath is done.
	}
	
	// Method: phpRequestExecutor::PrepDirectoryName
	// Internal Helper Only
	// Since PHP expects directories to end in a slash, let's make sure they do
	function PrepDirectoryName(&$arg_dirName)
	{
		// Make sure we have something reasonable
		if ((EMPTY_STRING != $arg_dirName) && ($this->att_constMaxPath >= strlen($arg_dirName)))
		{
			// Add that trailing slash.   
			// (No need to worry about direction of the slash, just deal with a missing one.)
			$strSlash = $arg_dirName[strlen($arg_dirName)-1];
			if (("/" != $strSlash) && ("\\" != $strSlash))
				$arg_dirName = $arg_dirName.SLASH_STRING;
			return true;
		}
		return false;
	}
	
	// Method: phpRequestExecutor::GetFormVar
	// Returns a safe variable from the request stream
	// This method provides a uniform way of accessing form variables without requiring
	// register_globals to be turned on.  Please refer to:
	// http://us3.php.net/manual/en/security.globals.php for details on why using
	// register_global support is bad.
	function GetFormVar($arg_strVarName)
	{
		// If the requested variable is declared in the POST stream, return it
		if(isset($_POST[$arg_strVarName]))
			return $_POST[$arg_strVarName];
		else
			return EMPTY_STRING;
	}

// End of phpRequestExecutor class.
}

// End of the class library section of this code
// --------------------------------------------------------------------------------------------------//

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
// Start of the actual working part of this code.

// Get us somebody who can handle the requests
$objRequestExecutor = new phpRequestExecutor();
// and tell them to do it!
$objRequestExecutor->Run();
// that//s it!

// End of the actual working part of this code.
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
?>
