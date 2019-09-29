<?php

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


function wp_interlude_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( 'Unauthorized user' );
    }
 
    if ( ! empty( $_POST ) && check_admin_referer( 'wp_interlude_nonce' ) ) {
        // Save new values
        update_option( 'wpi_selector', $_POST[ 'wpi_selector' ] );
        update_option( 'wpi_interval_frequency', $_POST[ 'wpi_interval_frequency' ] );
        update_option( 'wpi_interval_limit', $_POST[ 'wpi_interval_limit' ] );
        update_option( 'wpi_waiting_message', $_POST[ 'wpi_waiting_message' ] );
    }
    ?>
    <div class="Interlude-Admin">
        <h2><?php echo __( 'WP Interlude Settings', 'wp-interlude' ); ?></h2>
        <form class="Interlude-Form" method="post">
            <fieldset>
                <h3><?php echo __( 'API', 'wp-interlude' ); ?></h3>
                <label for="selector"><?php echo __( 'Selector', 'wp-interlude' ); ?></label>
                <input id="selector" name="wpi_selector" type="text" value="<?php echo stripslashes( esc_attr( get_option( 'wpi_selector' ) ) ); ?>" >
                <div class="Interlude-Form-helpText">
                    <?php echo __('The classname or ID of elements containing resources that need to be tested. Example: "[href^="https://s3-"]" targets any S3 resources.', 'wp-interlude') . "<br />"; ?>
                    <?php echo __('Read more about JQuery selectors here: ', 'wp-interlude') . '<a href="https://api.jquery.com/category/selectors/" target="_blank">https://api.jquery.com/category/selectors/</a>'; ?>
                </div>
            </fieldset>
            <hr />
            <fieldset>
                <h3><?php echo __( 'Interval Settings', 'wp-interlude' ); ?></h3>
                <label for="interval_frequency"><?php echo __( 'Frequency (seconds)', 'wp-interlude' ); ?></label>
                <input id="interval_frequency" name="wpi_interval_frequency" type="number" value="<?php echo esc_attr( get_option( 'wpi_interval_frequency' ) ); ?>">
                <div class="Interlude-Form-helpText">
                    <?php echo __('How often (in seconds) the API will try fetching a resource. ( Default 5 seconds )', 'wp-interlude'); ?>
                </div>
                <label for="interval_limit"><?php echo __( 'Limit', 'wp-interlude' ); ?></label>
                <input id="interval_limit" name="wpi_interval_limit" type="number" value="<?php echo esc_attr( get_option( 'wpi_interval_limit' ) ); ?>">
                <div class="Interlude-Form-helpText">
                    <?php echo __('The maximum number of times the API will attempt to fetch a resource before timing out. ( Default 240 tries )', 'wp-interlude'); ?>
                </div>
            </fieldset>
            <hr />
            <fieldset>
                <h3><?php echo __( 'Frontend', 'wp-interlude' ); ?></h3>
                <label for="waiting_message"><?php echo __( 'Waiting Message', 'wp-interlude' ); ?></label>
                <textarea id="waiting_message" name="wpi_waiting_message" rows="2"><?php echo esc_attr( get_option( 'wpi_waiting_message' ) ); ?></textarea>
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