<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://natehub.net
 * @since      1.0.0
 *
 * @package    WP_Interlude
 * @subpackage WP_Interlude/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    WP_Interlude
 * @subpackage WP_Interlude/public
 * @author     Nathan Blair <nate@natehub.net>
 */
class WP_Interlude_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/wp-interlude-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( 'interlude', plugin_dir_url( __FILE__ ) . 'js/interlude.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/wp-interlude-public.js', array( 'interlude' ), $this->version, false );


		$data = "window.wpInterludeOptions = {
			selector : '" . get_option( 'wpi_selector' ) . "',
			intervalFrequency : " . get_option( 'wpi_interval_frequency' ) . ",
			intervalLimit : " . get_option( 'wpi_interval_limit' ) . ",
			waitingMessage : '" . get_option( 'wpi_waiting_message' ) . "',
		}";
		wp_add_inline_script( 'interlude', $data );
	}

}