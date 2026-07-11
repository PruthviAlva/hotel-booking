# Requirement Analysis – Hotel Booking System

## 1. Problem Understanding

The objective is to build a full-stack hotel booking system with separate interfaces for guests and administrators. Guests should be able to search for available rooms, view room details, make bookings, complete a mock payment, receive a booking confirmation, and view their booking history. Administrators should be able to manage rooms, bookings, customers, and view dashboard statistics.

The core technical challenge is ensuring booking concurrency is handled safely, so room reservations and payments are processed atomically, preventing double bookings or inconsistent booking states.

The solution should not only implement the required functionality but also demonstrate sound software engineering practices, including system design, database modeling, documentation, testing, deployment, and handling of edge cases.

## 2. Key Assumptions

1. **Single Hotel for MVP, Multi-Hotel Ready**
   The initial application will manage one hotel, but the database schema will be designed to support multiple hotels in the future.

2. **Mock Payment Only**
   No real payment gateway integration is required. Payments will be simulated, and booking confirmation will depend on a successful mock payment.

3. **Authenticated Admin**
   Only authenticated administrators can access the admin dashboard and perform room or booking management operations.

4. **Booking Depends on Availability**
   A booking can only be confirmed if the selected room is available for the requested date range. The system must prevent overlapping bookings.

5. **Customer Identity**
   Each customer is uniquely identified by their email (or generated customer ID). Names are not considered unique identifiers.

6. **Payment Failure / Abandonment Behavior**
   If the mock payment fails or the user abandons the payment process, the booking should remain in a `Pending` state only for a limited time (or be cancelled immediately, based on business rules), and the room should become available again for other customers.

## 3. Clarification Questions

1. **Room Availability**
   Should room availability be calculated dynamically from existing bookings, or should each room maintain a separate availability status?

2. **Booking Lifecycle**
   I propose the booking lifecycle to be `Pending → Confirmed → Completed`, with `Cancelled` as an alternate terminal state if the payment fails or an admin/user cancels the booking. Does this match the expected business workflow, or should additional states (such as `Refunded` or `Expired`) be included?

3. **Payment Timeout**
   If a user starts the booking process but abandons it before completing payment, should the booking automatically expire after a specific time, and if so, after how long?