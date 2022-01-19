import PropTypes from 'prop-types';


export default function ErrorMessage({ message }) {
    if (!message) return null;

    return (
        <div className="bg-red-200 border-red-600 text-red-600 border-l-4 p-4 max-w" role="alert">
            <p className="font-bold">
                Error
            </p>
            <p className="max-w-sm">
                {message}
            </p>
        </div>

    );
}

ErrorMessage.propTypes = {
    message: PropTypes.string
}