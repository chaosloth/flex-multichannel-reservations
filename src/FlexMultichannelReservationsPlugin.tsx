import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import { Actions } from "@twilio/flex-ui";
import { RejectOptions, Reservation } from "twilio-taskrouter";

const PLUGIN_NAME = "FlexMultichannelReservationsPlugin";

const CUSTOM_TIMEOUT_STATE_NAME = "Timeout";

export default class FlexMultichannelReservationsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    // Listen for Worker activity to change
    manager.workerClient?.on("activityUpdated", (payload) => {
      console.log(
        PLUGIN_NAME + " - Worker Client - on - activityUpdated ***",
        payload
      );

      // Check if it's the custom state (Timeout)
      if (payload.activity.name === CUSTOM_TIMEOUT_STATE_NAME) {
        console.log(
          PLUGIN_NAME + " - Worker Client - Rejecting pending reservations"
        );

        // Create an array of promises, one for each reservation rejection
        const reservationRejections = Array<Promise<Reservation>>();
        manager.workerClient?.reservations.forEach((reservation) => {
          reservationRejections.push(reservation.reject());
        });

        // Execute all promises
        Promise.all(reservationRejections)
          .then(() => {
            console.log(
              PLUGIN_NAME + " - All outstanding reservations rejected"
            );
          })
          .catch(function (err) {
            // Log an error when a reservation could not be rejected (e.g. Already rejected)
            console.log(
              PLUGIN_NAME +
                " - A reservationRejections promise failed to resolve"
            );
          });
      }
    });
  }
}
