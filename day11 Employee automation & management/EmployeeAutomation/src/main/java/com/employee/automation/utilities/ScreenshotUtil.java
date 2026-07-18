package com.employee.automation.utilities;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * ScreenshotUtil provides utility methods to capture screenshots
 * of the browser viewport during test executions (specifically on failures).
 */
public class ScreenshotUtil {

    /**
     * Captures a screenshot of the current browser window and saves it to a file.
     * 
     * @param driver The WebDriver instance
     * @param testName The name of the test case executing
     * @return String absolute path of the saved screenshot
     */
    public static String takeScreenshot(WebDriver driver, String testName) {
        // Cast driver to TakesScreenshot interface
        TakesScreenshot ts = (TakesScreenshot) driver;
        
        // Capture screenshot as a temporary file
        File source = ts.getScreenshotAs(OutputType.FILE);
        
        // Generate a unique timestamp to prevent file overwrites
        String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        
        // Define destination file path (saved under reports/screenshots/ directory)
        String relativePath = "./reports/screenshots/" + testName + "_" + timestamp + ".png";
        File destination = new File(relativePath);
        
        try {
            // Copy temporary file to the final destination directory
            FileUtils.copyFile(source, destination);
        } catch (IOException e) {
            System.err.println("Failed to save screenshot: " + e.getMessage());
        }
        
        // Return absolute path to allow ExtentReports listener to link it
        return destination.getAbsolutePath();
    }
}
