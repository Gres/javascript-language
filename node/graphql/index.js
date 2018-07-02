const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLSchema,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLFloat
} = require('graphql');

const book1 =
    {
        title: 'Dummy Book 1',
        pages: 100,
        author: null 
    };

const book2 =
    {
        title: 'Dummy Book 2',
        pages: 100,
        author: null 
    };

const book3 =
    {
        title: 'Dummy Book 3',
        pages: 100,
        author: null 
    };

const author1 = {
    name: 'foo',
    gender: 'bar',
    books: [
        book1,
        book2
    ]
};

const author2 = {
    name: 'ally',
    gender: 'john',
    books: [
        book1,
        book3
    ]
};

book1.author = author1;
book2.author = author2;

const database = {
    books: [
        book1,
        book2
    ],
    authors: [
        author1,
        author2
    ]
};

const Author = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        name: {
            type: GraphQLString
        },
        gender: {
            type: GraphQLString
        },
        books: {
            type: new GraphQLList(Book)
        }
    })
});

const Book = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        title: {
            type: GraphQLString
        },
        pages: {
            type: GraphQLInt
        },
        author: {
            type: Author
        }
    })
});

const rootQuery = new GraphQLObjectType({
        name: 'Query',
        fields: {
            getBook: {
                type: Book,
                args: {
                    title: { type: GraphQLString },
                    pages: { type: GraphQLInt },
                    author: { type: GraphQLString }
                },
                resolve: (__, { title, pages, author }) => {
                    const books = database.books;
                    return books[Math.floor(Math.random() * books.length)];
                }
            },
            getBooks: {
                type: new GraphQLList(Book),
                resolve: () => {
                    return database.books;
                }
            }
        }        
    });
    
    const rootMutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            addBook: {
                type: new GraphQLList(Book),
                args: {
                    title: { type: GraphQLString },
                    pages: { type: GraphQLInt },
                    author: { type: GraphQLString }
                },
                resolve: (__, { title, pages, author }) => {
                    const books = database.books;
                    books.push({ title, pages, author });
                    return books;
                }
            }
        }        
    });

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation 
});

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');