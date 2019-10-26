<?php
/**
 * WP Interlude
 * 
 * A simple plugin which runs JS to check that a linked file is available,
 * and until it is, it shows a waiting message.
 * 
 * @since       1.0.0
 * @package     WP_Interlude
 * 
 * @wordpress-plugin
 * Plugin Name:       WP Interlude
 * Plugin URI:        https://natehub.net
 * Description:       A simple plugin which shows a waiting message until a resource is available for download.
 * Version:           1.2.0
 * Author:            Nathan Blair
 * Author URI:        https://natehub.net
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wp-interlude
 * Domain Path:       /languages
 */

 // If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die("This is a plugin, which cannot be accessed directly.");
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 */
define( 'WP_INTERLUDE_VERSION', '1.2.0' );

/**
 * The code that runs during plugin activation.
 */
function activate_plugin_name() {
	add_option( 'wpi_selector', '' );
    add_option( 'wpi_interval_frequency', 5 );
    add_option( 'wpi_interval_limit', 240 );
    add_option( 'wpi_waiting_message', __( 'Please Wait', 'wp-interlude' ) );
}
/**
 * The code that runs during plugin deactivation.
 */
function deactivate_plugin_name() {
	delete_option( 'wpi_selector' );
    delete_option( 'wpi_interval_frequency' );
    delete_option( 'wpi_interval_limit' );
    delete_option( 'wpi_waiting_message' );
}
register_activation_hook( __FILE__, 'activate_plugin_name' );
register_deactivation_hook( __FILE__, 'deactivate_plugin_name' );


/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-wp-interlude.php';

/**
 * Begins execution of the plugin.
 *
 * @since    1.0.0
 */
function run_plugin_name() {
	$plugin = new WP_Interlude();
	$plugin->run();
}
run_plugin_name();