import { pool } from './pool.js';

async function seed() {
    //Hotels
    const hotel1 = await pool.query(
        `INSERT INTO hotels (name, address, description, amenities, images, rating)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        ['Trinity Suites', 'MG Road, Bangalore', 'A luxury stay in the heart of the city.', ['WiFi', 'Pool'], ['https://images.unsplash.com/photo-1'], 4.5]
    );
    const hotel1Id = hotel1.rows[0].id;

    const hotel2 = await pool.query(
        `INSERT INTO hotels (name, address, description, amenities, images, rating)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        ['Empire', 'Whitefield, Bangalore', 'Modern comfort for business travelers.', ['WiFi', 'Gym'], ['https://images.unsplash.com/photo-2'], 4.2]
    );
    const hotel2Id = hotel2.rows[0].id;

    //Rooms
    const room1 = await pool.query(
        `INSERT INTO rooms (hotel_id, room_number, room_type, price, capacity, description, images, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [hotel1Id, '101', 'Deluxe', 150.00, 2, 'Spacious room with city view.', ['https://images.unsplash.com/room-1'], 'Available']
    );
    const room1Id = room1.rows[0].id;

    const room2 = await pool.query(
        `INSERT INTO rooms (hotel_id, room_number, room_type, price, capacity, description, images, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [hotel1Id, '102', 'Standard', 90.00, 2, 'Cozy room with all essentials.', ['https://images.unsplash.com/room-2'], 'Available']
    );
    const room2Id = room2.rows[0].id;

    const room3 = await pool.query(
        `INSERT INTO rooms (hotel_id, room_number, room_type, price, capacity, description, images, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [hotel2Id, '101', 'Suite', 220.00, 4, 'Premium suite with lounge area.', ['https://images.unsplash.com/room-3'], 'Available']
    );
    const room3Id = room3.rows[0].id;

    const room4 = await pool.query(
        `INSERT INTO rooms (hotel_id, room_number, room_type, price, capacity, description, images, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [hotel2Id, '102', 'Deluxe', 150.00, 3, 'Spacious room with city view.', ['https://images.unsplash.com/room-4'], 'Available']
    );
    const room4Id = room4.rows[0].id;

    console.log('Seed complete:', { hotel1Id, hotel2Id, room1Id, room2Id, room3Id, room4Id });
}

seed()
    .then(() => pool.end())
    .catch((err) => {
        console.error('Seed failed:', err);
        pool.end();
    });