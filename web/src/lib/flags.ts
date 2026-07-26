/**
 * Booking is gated until there is real operator supply and, for carpool, legal
 * clearance. While this is false the search results, trip detail and booking
 * pages are unreachable, so nothing on the site implies a seat can be booked
 * today. See PLAN.md section 2 and CARPOOL-COST-SHARE.md section 7.
 *
 * Flip to true only when both are true:
 *   1. At least one CPC-holding operator is live on the corridor.
 *   2. Carpool listings, if shown, are cleared by transport counsel.
 */
export const BOOKING_ENABLED = false;
