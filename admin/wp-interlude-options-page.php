<?php

/**
 * Add plugin settings link to Admin menu.
 *
 * @since    1.0.0
 *
 * @return   void
**/
function wp_interlude_menu() {
    add_options_page(
        'WP Interlude Settings',
        'WP Interlude',
        'manage_options',
        'wp_interlude',
        'wp_interlude_settings_page'
    );
}
add_action('admin_menu', 'wp_interlude_menu');


/**
 * Build the UI for the settings page.
 *
 * @since    1.0.0
 *
 * @return   void
**/
function wp_interlude_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( __( 'Unauthorized user', 'wp-interlude' ) );
    }

    $tinymce_toolbar1 = array(
        'formatselect',
        'bold',
        'italic',
        'underline',
        'bullist',
        'numlist',
        'alignleft',
        'aligncenter',
        'alignright',
        'alignjustify',
        'link',
        'unlink',
        'forecolor',
        'removeformat',
        'undo',
        'redo',
    );

    $wp_editor_settings = array(
        'textarea_rows' => 8,
        'tinymce'       => array(
            'toolbar1'  => implode( ',', $tinymce_toolbar1 ),
            'toolbar2'  => '',
        ),
    );

    if ( ! empty( $_POST ) && check_admin_referer( 'wp_interlude_nonce' ) ) {
        // Save new values
        update_option( 'wpi_selector', $_POST[ 'wpi_selector' ] );
        update_option( 'wpi_interval_frequency', $_POST[ 'wpi_interval_frequency' ] );
        update_option( 'wpi_interval_limit', $_POST[ 'wpi_interval_limit' ] );
        update_option( 'wpi_waiting_message', $_POST[ 'wpi_waiting_message' ] );
    }
    ?>
    <div class="Interlude-Admin">
        <h2><?php _e( 'WP Interlude Settings', 'wp-interlude' ); ?></h2>
        <form class="Interlude-Form" method="post">
            <fieldset>
                <h3><?php _e( 'API', 'wp-interlude' ); ?></h3>
                <label for="selector"><?php _e( 'Selector', 'wp-interlude' ); ?></label>
                <input id="selector" name="wpi_selector" type="text" value="<?php echo stripslashes( esc_attr( get_option( 'wpi_selector' ) ) ); ?>" >
                <div class="Interlude-Form-helpText">
                    <?php _e('The classname or ID of elements containing resources that need to be tested. Example: "[href^="https://s3-"]" targets any S3 resources.', 'wp-interlude'); ?>
                    <br />
                    <?php _e('Read more about JQuery selectors here: ', 'wp-interlude'); ?>
                    <a href="https://api.jquery.com/category/selectors/" target="_blank">https://api.jquery.com/category/selectors/</a>
                </div>
            </fieldset>
            <hr />
            <fieldset>
                <h3><?php _e( 'Interval Settings', 'wp-interlude' ); ?></h3>
                <label for="interval_frequency"><?php _e( 'Frequency (seconds)', 'wp-interlude' ); ?></label>
                <input id="interval_frequency" name="wpi_interval_frequency" type="number" value="<?php echo esc_attr( get_option( 'wpi_interval_frequency' ) ); ?>">
                <div class="Interlude-Form-helpText">
                    <?php _e('How often (in seconds) the API will try fetching a resource. ( Default 5 seconds )', 'wp-interlude'); ?>
                </div>
                <label for="interval_limit"><?php _e( 'Limit', 'wp-interlude' ); ?></label>
                <input id="interval_limit" name="wpi_interval_limit" type="number" value="<?php echo esc_attr( get_option( 'wpi_interval_limit' ) ); ?>">
                <div class="Interlude-Form-helpText">
                    <?php _e('The maximum number of times the API will attempt to fetch a resource before timing out. ( Default 240 tries )', 'wp-interlude'); ?>
                </div>
            </fieldset>
            <hr />
            <fieldset>
                <h3><?php _e( 'Frontend', 'wp-interlude' ); ?></h3>
                <label for="waiting_message"><?php _e( 'Waiting Message', 'wp-interlude' ); ?></label>
                <div class="Interlude-Form-helpText">
                    <?php _e('This message will appear while your asset is loading.', 'wp-interlude'); ?>
                </div>
                <?php wp_editor( stripslashes( get_option( 'wpi_waiting_message' ) ), 'wpi_waiting_message', $wp_editor_settings ); ?>
            </fieldset>
            <hr />
            <fieldset>
                <?php wp_nonce_field( 'wp_interlude_nonce' ); ?>
                <?php submit_button(); ?>
            </fieldset>
        </form>
    </div>
    <?php
}