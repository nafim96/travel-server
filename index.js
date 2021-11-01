const express = require( "express" );
const cors = require( "cors" );
const MongoClient = require( "mongodb" ).MongoClient;
const ObjectId = require( "mongodb" ).ObjectID;
require( "dotenv" ).config();
const app = express();

const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.j9fza.mongodb.net/travel?retryWrites=true&w=majority`;

const port = 5000;

app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
const client = new MongoClient( uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} );

app.get( "/", ( req, res ) =>
{
    res.send( "Hello World!" );
} );

client.connect( ( err ) =>
{
    const serviceCollection = client
        .db( `travel` )
        .collection( `service` );


    const userServiceCollection = client
        .db( `travel` )
        .collection( `userService` );

    const userContactCollection = client
        .db( `travel` )
        .collection( `addContact` );

    app.post( "/addService", ( req, res ) =>
    {
        const service = req.body;
        serviceCollection.insertOne( service ).then( ( result ) =>
        {
            res.send( result.insertedCount > 0 );
        } );
    } );

    app.post( "/addUserOrder", ( req, res ) =>
    {
        const UserOrder = req.body;
        userServiceCollection.insertOne( UserOrder ).then( ( result ) =>
        {
            res.send( result.insertedCount > 0 );
        } );
    } );

    app.post( "/addUserContact", ( req, res ) =>
    {
        const contact = req.body;
        userContactCollection.insertOne( contact ).then( ( result ) =>
        {
            res.send( result.insertedCount > 0 );
        } );
    } );

    app.patch( "/updateStatus/:id", ( req, res ) =>
    {
        console.log( req.body.value );
        userServiceCollection
            .updateOne(
                { _id: ObjectId( req.params.id ) },
                {
                    $set: { status: req.body.value },
                }
            )
            .then( ( result ) =>
            {
                console.log( result );
                res.send( result.modifiedCount > 0 );
            } );
    } );

    app.get( "/services", ( req, res ) =>
    {
        serviceCollection.find( {} ).toArray( ( err, documents ) =>
        {
            res.send( documents );
        } );
    } );

    app.get( "/userServices", ( req, res ) =>
    {
        userServiceCollection.find( {} ).toArray( ( err, documents ) =>
        {
            res.send( documents );
        } );
    } );


    app.delete( "/deleteService/:id", ( req, res ) =>
    {
        serviceCollection
            .findOneAndDelete( { _id: ObjectId( req.params.id ) } )
            .then( ( err, documents ) =>
            {
                res.send( !!documents.value );
            } );
    } );

    app.delete( "/deleteOrder/:id", ( req, res ) =>
    {
        userServiceCollection
            .findOneAndDelete( { _id: ObjectId( req.params.id ) } )
            .then( ( err, documents ) =>
            {
                res.send( !!documents.value );
            } );
    } );

} );

app.listen( process.env.PORT || port );