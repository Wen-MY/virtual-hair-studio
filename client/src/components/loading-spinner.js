import SyncLoader from 'react-spinners/SyncLoader'

const Loader = () => {
    return(
        <div className='loading'>
            <SyncLoader
            color="#36d7b7"
            margin={2}
            speedMultiplier={1}
            />
        </div>
    );
}

export default Loader;