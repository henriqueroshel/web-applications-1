import sqlite from "sqlite3";
import dayjs from "dayjs";

function Film(filmId, title, isFavorite=false, watchDate=undefined, rating=undefined, userId=1){
    this.id = filmId;
    this.title = title;
    this.isFavorite = isFavorite;
    this.watchDate = watchDate && dayjs(watchDate);
    this.rating = rating;
    this.userId = userId;

    this.toString = () => {
        let s = `${this.id}. `
        s += (this.isFavorite) ? '\u2605 ' : '\u2606 '
        s += `${this.title} - `
        s += (this.watchDate) ? `watched on ${this.watchDate.format('YYYY-MM-DD')}` : 'not watched'
        s += ` by user ${this.userId}; `
        s += (this.rating) ? `rating: ${this.rating}` : 'not rated'
        return s
    }
}

function FilmLibrary() {
    this.films = [] ;

    this.toString = () => { 
        let s = "FilmLibrary:"
        this.films.forEach(film => {
            s += `\n${film.toString()}`
        }) 
        return s
    }
    this.addNewFilm = film => { 
        if(this.films.some(f => f.id==film.id))
            throw new Error('Duplicated id');
        else
            this.films.push(film);
    }
    this.sortByDate = () => { 
        const compareFn = (filmA,filmB) => {
            if(typeof filmA.watchDate === 'undefined')
                return +1 ;
            else if(typeof filmB.watchDate === 'undefined')
                return -1 ;
            else 
                // return filmA.watchDate.valueOf() - filmB.watchDate.valueOf()
                return filmA.watchDate.diff(filmA.watchDate, 'day')
        }
        let sortedFilms = [...this.films]
        sortedFilms.sort( compareFn ) 
        return sortedFilms
    }
    this.deleteFilm = deleteFilmId => {
        const newFilms = this.films.filter(film => film.id !== deleteFilmId)
        this.films = newFilms;
    }
    this.resetWatchedFilms = function() { 
        this.films.forEach((film) => delete film.watchDate);
    }
    this.getRated = function() {
        let ratedFilms = this.films.filter(film => film.rating>0)
        ratedFilms.sort((filmA,filmB) => filmB.rating-filmA.rating)
        return ratedFilms
    }


}

function row2film(row) {
    return new Film(
        row.id, 
        row.title, 
        row.isFavorite, 
        row.watchDate, 
        row.rating, 
        row.userId
    )
}

function getFilms() {
    return new Promise((resolve, reject)=>{
        const query = "SELECT * FROM films" 
        db.all(query, (err, rows)=>{
            if (err)
                reject(err)
            else
                resolve(rows.map(row2film))
        })
    }) ;
}
function getFavorites() {
    return new Promise((resolve, reject)=>{
        const query = "SELECT * FROM films WHERE isFavorite=1" 
        db.all(query, (err, rows)=>{
            if (err)
                reject(err)
            else 
                resolve(rows.map(row2film))
        })
    }) ;
}
function getWatchedToday() {
    return new Promise((resolve, reject)=>{
        const today = dayjs().format('YYYY-MM-DD')
        const query = "SELECT * FROM films WHERE watchDate=?" 
        db.all(query, [today], (err, rows)=>{
            if (err)
                reject(err)
            else {
                resolve(rows.map(row2film))
            }
        })        
    })
}
function getWatchedAfter(date) {
    return new Promise((resolve, reject)=>{
        const query = "SELECT * FROM films WHERE watchDate>?" 
        db.all(query, [date], (err, rows)=>{
            if (err)
                reject(err)
            else {
                resolve(rows.map(row2film))
            }
        })        
    })
}
function getRated(score) {
    return new Promise((resolve, reject)=>{
        const query = "SELECT * FROM films WHERE rating>=?" 
        db.all(query, [score], (err, rows)=>{
            if (err)
                reject(err)
            else {
                resolve(rows.map(row2film))
            }
        })        
    })
}
function getTitle(text) {
    text = text.toLowerCase()
    return new Promise((resolve, reject)=>{
        const query = "SELECT * FROM films" 
        db.all(query, (err, rows)=>{
            if (err)
                reject(err)
            else {
                resolve(
                    rows.map(row2film)
                        .filter(f=>f.title.toLowerCase().includes(text))
                )
            }
        })        
    })
}

function insertFilm(film) {
    let insertQuery = `INSERT INTO films (id, title, isFavorite, rating, watchDate, userId) \
                       VALUES (?, ?, ?, ?, ?, ?)` ;
    db.run(
        insertQuery,
        [film.id, film.title, film.isFavorite, film.rating, film.watchDate.format("YYYY-MM-DD"), film.userId],
        function (err) { 
            if (err) {console.log(err.message);} 
            console.log(`Film "${film.title}" successfully inserted into database`);         
        },
    )
}
function deleteFilm(filmId) {
    let deleteQuery = 'DELETE FROM films WHERE id=?'
    db.run(
        deleteQuery,
        [filmId],
        function (err) { 
            if (err) {console.log(err.message);} 
            console.log(`Film ${filmId} successfully deleted from database`);         
        },
    )
}
function resetWatchDate() {
    let query = 'UPDATE films SET watchDate=NULL'
    db.run(
        query,
        function (err) { 
            if (err) {console.log("Could not delete watch dates from database");} 
            console.log(`Watch date successfully deleted from database`);         
        },        
    )
}

const db = new sqlite.Database('films.db',
                (err) => { if (err) throw err; } );

function main() {

    // let film = new Film(0, "Scream", true, dayjs('2020-08-02'), 3);
    // filmLibrary.addNewFilm(film)
    // filmLibrary.films.forEach(insertFilmDB)

    // getFilms()
    //     .then((films)=>{films.forEach(film => console.log(film.toString()))})
    // getFavorites()
    //     .then((films)=>{films.forEach(film => console.log(film.toString()))})
    // getWatchedToday()
    //     .then((films)=>{films.forEach(film => console.log(film.toString()))})
    // getWatchedAfter("2024-03-01")
    //     .then((films)=>{films.forEach(film => console.log(film.toString()))})
    // getRated(4)
    //     .then((films)=>{films.forEach(film => console.log(film.toString()))})
    // getTitle("aM")
    //     .then((films)=>{films.forEach(film => console.log(film.toString()))})

    // let film = new Film( 7,"21 Grams", true, dayjs("2024-03-07"), 3, 1 )
    // insertFilm(film)
    // deleteFilm(7);
    // resetWatchDate();

    // getFilms()
    //     .then((films)=>{films.forEach(film => console.log(film.toString()))})

}

main();

db.close();
