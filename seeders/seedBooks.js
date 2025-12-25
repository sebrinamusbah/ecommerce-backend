const { Book, Category, User } = require('../models');
const { sequelize } = require('../config/db');

const seedDatabase = async() => {
    try {
        // Clear existing data
        await sequelize.sync({ force: true });
        console.log('Database cleared');

        // Create categories
        const categories = await Category.bulkCreate([
            { name: 'Fiction', description: 'Fictional literature', slug: 'fiction' },
            { name: 'Non-Fiction', description: 'Non-fictional works', slug: 'non-fiction' },
            { name: 'Science Fiction', description: 'Sci-fi books', slug: 'science-fiction' },
            { name: 'Fantasy', description: 'Fantasy literature', slug: 'fantasy' },
            { name: 'Biography', description: 'Biographical works', slug: 'biography' }
        ]);

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@bookstore.com',
            password: 'password123',
            role: 'admin'
        });

        // Create regular user
        const user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user'
        });

        // Create books
        const books = await Book.bulkCreate([{
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                isbn: '9780743273565',
                description: 'A classic novel about the American Dream',
                price: 12.99,
                stock: 50,
                publishedDate: '1925-04-10',
                pages: 180,
                language: 'English',
                isFeatured: true
            },
            {
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                isbn: '9780061120084',
                description: 'A novel about racial injustice',
                price: 14.99,
                stock: 30,
                publishedDate: '1960-07-11',
                pages: 281,
                language: 'English',
                isFeatured: true
            },
            {
                title: '1984',
                author: 'George Orwell',
                isbn: '9780451524935',
                description: 'Dystopian social science fiction',
                price: 10.99,
                stock
            }
        ])
    }
}