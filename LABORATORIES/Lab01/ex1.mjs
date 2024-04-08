import dayjs from "dayjs";

let filmsId = 0;
function Film(title, isFavorite=false, watchDate, rating, userId=1){
    this.id = filmsId++;
    this.title = title;
    this.isFavorite = isFavorite;
    this.watchDate = watchDate && dayjs(watchDate);
    this.rating = rating;
    this.userId = userId;

    this.toString = () => {
        let s = `${this.id}. `
        s += (this.isFavorite) ? '\u2605 ' : '\u2606 '
        s += `${this.title} - `
        s += (this.watchDate) ? `watched on ${watchDate.format("DD/MM/YYYY")}` : 'not watched'
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

function main() {
    const filmLibrary = new FilmLibrary();

    let film0 = new Film("Scream", true, dayjs('2020-08-02'), 3);
    let film1 = new Film("Joker", false, dayjs('2021-05-15'), 2);
    let film2 = new Film("Tropa de Elite", false, undefined, 5);
    let film3 = new Film("Halloween", true, dayjs('2022-07-27'), 1);
    let film4 = new Film("Back to the Future", true, dayjs('2020-12-04'), undefined);

    filmLibrary.addNewFilm(film0)
    filmLibrary.addNewFilm(film1)
    filmLibrary.addNewFilm(film2)
    filmLibrary.addNewFilm(film3)
    filmLibrary.addNewFilm(film4)

    console.log(filmLibrary.toString())

    let sortedLibrary = filmLibrary.sortByDate()
    // console.log(filmLibrary.films)
    // console.log("\nfilmLibrary.sortByDate()")
    // console.log(sortedLibrary.map(film => film.title))

    filmLibrary.deleteFilm(1)
    // console.log(filmLibrary.films)
    // console.log("\nfilmLibrary.deleteFilm(1)")
    // console.log(filmLibrary.films.map(film => film.title))
    console.log(filmLibrary.toString())

    // filmLibrary.resetWatchedFilms()
    // console.log("\nfilmLibrary.resetWatchedFilms()")
    // console.log(filmLibrary.films)

    let ratedFilms = filmLibrary.getRated()
    // console.log("\nfilmLibrary.getRated()")
    // console.log(ratedFilms.map(film => film.title))
}

main();