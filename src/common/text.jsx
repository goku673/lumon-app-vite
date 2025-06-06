const Text = ({text, className, ...props}) => {
    return (
        <div className={`text-base font-normal text-center ${className}`} {...props}>
        {text}
        </div>
    )
}

export default Text;