

const addCeroBefore = (fecha) => {
            
    if( fecha < 10 ){
        return "0" + fecha.toString()
    } else {
        return fecha.toString()
    }
}

module.exports = {addCeroBefore}