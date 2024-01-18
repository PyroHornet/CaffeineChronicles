router.get('/', async function (req, res, next) {
    let conn;
    try {
        conn = await pool.getConnection();
        // Modify the SQL query to retrieve items from the cart table based on the user or session
        const cartItems = await conn.query("SELECT * FROM Cart WHERE user_id = ? LIMIT 1", [req.user.id]);

        // Calculate the total price of items in the cart
        let total = 0;
        for (const item of cartItems) {
            total += item.price; // Assuming the column name for item price is 'price'
        }

        // Assuming you have a view named 'cart' to display cart items
        res.render('cart', { cartItems: cartItems, total: total });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: err }); // Render an error page
    } finally {
        if (conn) conn.end();
    }
});
