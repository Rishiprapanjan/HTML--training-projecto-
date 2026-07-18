package com.employee.automation.utilities;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * ConfigReader is a utility class designed to load and retrieve key-value pairs
 * from the config.properties file, avoiding hardcoding in the test scripts.
 */
public class ConfigReader {

    private static Properties properties;
    private static final String CONFIG_FILE_PATH = "./config.properties";

    /**
     * Initializes and loads the config.properties file.
     * Called once at the beginning of the test suite execution.
     */
    public static void initProperties() {
        properties = new Properties();
        try (FileInputStream fis = new FileInputStream(CONFIG_FILE_PATH)) {
            properties.load(fis);
        } catch (IOException e) {
            throw new RuntimeException("Could not read or find configuration file at: " + CONFIG_FILE_PATH, e);
        }
    }

    /**
     * Retrieves the value associated with the specified key.
     * 
     * @param key The property key
     * @return String value of the property, or null if key does not exist
     */
    public static String getProperty(String key) {
        if (properties == null) {
            initProperties(); // Safety fallback: Auto-initialize if not done already
        }
        return properties.getProperty(key);
    }
}
