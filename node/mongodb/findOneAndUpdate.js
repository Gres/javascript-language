const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});

const Blog = mongoose.model('Blog', blogSchema);

mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  //Blog.findOneAndUpdate({ title: 'test' }, { title: 'test1' }, { upsert: true })
  // without upsert: true, if nothing was found, nothing were updated or upserted 
/*   Blog.findOneAndUpdate({ title: 'test' }, { title: 'test1' })
    .then(res => {
      return Blog.find();
    })
    .then(res => {
      1;
    })
    .catch(err => console.log(err)); */
    
  //Blog.findByIdAndUpdate('5bb6751433d6076847f6f031', { title: 'test1' })
  Blog.findByIdAndUpdate('5bb6751433d6076847f6f031', { title: 'test1' }, { upsert: true })
    .then(res => {
      return Blog.find();
    })
    .then(res => {
      1;
    })
    .catch(err => console.log(err)); 
});
