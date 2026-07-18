package com.employee.automation.utilities;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.edge.EdgeDriver;

/**
 * DriverFactory class implements a thread-safe Singleton-like pattern for WebDriver instance management.
 * Using ThreadLocal ensures that each thread in parallel execution has its own isolated WebDriver instance.
 */
public class DriverFactory {

    // ThreadLocal acts as a container for holding thread-safe WebDriver instances
    private static ThreadLocal<WebDriver> tlDriver = new ThreadLocal<>();

    /**
     * Initializes the WebDriver instance for the specified browser.
     * 
     * @param browser The browser name (chrome, firefox, edge)
     * @return WebDriver initialized driver
     */
    public static WebDriver initDriver(String browser) {
        if (tlDriver.get() == null) {
            String browserName = browser.trim().toLowerCase();
            
            switch (browserName) {
                case "chrome":
                    // Setup Chrome binary dynamically using WebDriverManager
                    WebDriverManager.chromedriver().setup();
                    
                    // Configure Chrome startup preferences via ChromeOptions
                    ChromeOptions options = new ChromeOptions();
                    options.addArguments("--start-maximized"); // Start browser in maximized mode
                    options.addArguments("--disable-infobars"); // Disable info bars
                    options.addArguments("--disable-extensions"); // Disable existing extensions
                    options.addArguments("--remote-allow-origins=*"); // Address Chrome websocket connections issues
                    
                    // Instantiate ChromeDriver and store in ThreadLocal
                    tlDriver.set(new ChromeDriver(options));
                    break;

                case "firefox":
                    WebDriverManager.firefoxdriver().setup();
                    tlDriver.set(new FirefoxDriver());
                    break;

                case "edge":
                    WebDriverManager.edgedriver().setup();
                    tlDriver.set(new EdgeDriver());
                    break;

                default:
                    throw new RuntimeException("Invalid browser name provided: " + browser);
                }
        }
        return getDriver();
    }

    /**
     * Returns the WebDriver instance allocated to the current thread.
     * 
     * @return WebDriver instance
     */
    public static synchronized WebDriver getDriver() {
        return tlDriver.get();
    }

    /**
     * Closes the active browser instance and cleans up the thread memory.
     */
    public static void closeDriver() {
        if (tlDriver.get() != null) {
            tlDriver.get().quit(); // Close all windows and end the driver session
            tlDriver.remove();    // Remove the driver reference from current thread memory
        }
    }
}
