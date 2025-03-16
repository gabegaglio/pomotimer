import useQuote from './hooks/useQuote.js';


function Quotes () {
    
    const { quote, author } = useQuote();

    return (
        <div className="width-fit bg-white-opacity-30">
            <p className="text-center ">{quote}</p>
            <p>- {author}</p>
        </div>
    )
};

export default Quotes