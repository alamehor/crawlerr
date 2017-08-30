import url      from "url";
import mixin    from "merge-descriptors";
import wildcard from "wildcard-named";

export default {
    crawling  : false,
    callbacks : {},

    when( uri, callback ) {
        if ( ! this.crawling ) {
            this.crawling = true;

            // Deffer:
            setTimeout( () => this.init(), 0 );
        }

        this.add( uri, callback );
    },

    add( uri, callback ) {
        const href = url.resolve( this.base, uri );
        const resp = callback;

        this.callbacks[ href ] = resp;
    },

    check( uri, req, res ) {
        for ( let index in this.callbacks ) {
            const requested = wildcard( uri, index );
            const callback  = this.callbacks[ index ];

            if ( uri === index || requested ) {
                mixin( req.params, requested || {} );
                callback( req, res, uri );
            }
        }
    }
};
