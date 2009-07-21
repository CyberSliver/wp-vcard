<?php
/**
 * Phing JsMinTask
 * Uses JsMin PHP port from
 * http://code.google.com/p/jsmin-php/
 * Based on kpMinTask from
 * http://www.thepopeisdead.com/main/comments/easy_javascript_css_compression_with_phing/
 */

require_once 'phing/Task.php';

require_once(dirname(__FILE__).'/jsmin-1.1.1.php');

/**
 * JsMinTask adds JsMin to Phing
 */
class JsMinTask extends Task
{
	/**
     * The source files
     *
     * @var  FileSet
     */
    protected $filesets    = array();

    /**
     * Whether the build should fail, if
     * errors occured
     *
     * @var boolean
     */
    protected $failonerror = true;

    /**
     * Directory to put minified javascript files into
     *
     * @var  string
     */
    protected $destDir;
    
    /**
     * Force minify of unchanged files
     * 
     * @var boolean
     */
    protected $force;
 
    /**
     *  Nested creator, adds a set of files (nested fileset attribute).
     */
    public function createFileSet()
    {
        $num = array_push($this->filesets, new FileSet());
        return $this->filesets[$num - 1];
    }
 
    /**
     * Whether the build should fail, if an error occured.
     *
     * @param boolean $value
     */
    public function setFailonerror($value)
    {
        $this->failonerror = (boolean) $value;
    }
 
    /**
     * Sets the minify target dir
     *
     * @param  string  $targetDir
     */
    public function setDestDir($destDir)
    {
        $this->destDir = $destDir;
    }
 
    /**
     * Force minify on unchanged files.
     */
    public function setForce($value)
    {
    	$this->force = (boolean) $value;
    }
    
    /**
     * The init method: Do init steps.
     */
    public function init()
    {
        return true;
    }
    
	/**
     * The main entry point method.
     */
	public function main()
	{
    	foreach($this->filesets as $fs)
        {
            try
            {
                $files    = $fs->getDirectoryScanner($this->project)->getIncludedFiles();
                $fullPath = realpath($fs->getDir($this->project));
               
                foreach($files as $file)
                {
                    $this->log('Minifying file ' . $file);
 
                    $target = $this->destDir . '/' . str_replace($fullPath, '', $file);
                   
                    if (file_exists(dirname($target)) == false)
                    {
                        mkdir(dirname($target), 0700, true);
                    }
                   
                    $minify = true;
                    if (file_exists($target)) {
                    	$targetChanged = filectime($target);
                    	$sourceChanged = filectime($fullPath . DIRECTORY_SEPARATOR . $file);
                    	
                    	if ($sourceChanged > $targetChanged)
                    	{
                    		$this->log('Minifying file: ' . $target, Project::MSG_VERBOSE);
                    		$minify = true;
                    	} else {
                    		if ($this->force === true)
                    		{
                    			$this->log('Forced minify file: ' . $file, Project::MSG_VERBOSE);
                    			$minify = true;
                    		} else {
                    			$this->log('Skipping unchanged file: ' . $file, Project::MSG_VERBOSE);
                    			$minify = false;
                    		}
                    	}
                    } else {
                    	$this->log('Minifying file: ' . $target, Project::MSG_VERBOSE);
                    }

                    if ($minify === true) {
                    	$output = JSMin::minify(file_get_contents($fullPath . DIRECTORY_SEPARATOR . $file));
                    	if (strlen($output) == 0) {
                    		$this->log('JSMin returned empty for '.$file, Project::MSG_WARN);
                    	}

                    	$destFile = fopen($target, 'w');
                    	if ($destFile === false) {
                    		throw new BuildException('Could not open target file: ' . $target);
                    	}
                    	fwrite($destFile, $output);
                    	fclose($destFile);
                    }

                }
            }
           
            catch( BuildException $be )
            {
                // directory doesn't exist or is not readable
                if ($this->failonerror)
                {
                    throw $be;
                }
                else
                {
                    $this->log($be->getMessage(), $this->quiet ? Project::MSG_VERBOSE : Project::MSG_WARN);
                }
            }
            catch (JSMinException $JSMinE)
            {
            	$this->log($JSMinE->getMessage());
            }
        }
	}
}

/* EOF */
?>