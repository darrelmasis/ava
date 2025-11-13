import classNames from "classnames"

const Box = ({ children, className = '', ...props }) => {

  const boxClasses = classNames(
    'p-6 rounded-lg',
    'bg-white dark:bg-neutral-800',
    'border border-gray-200 dark:border-neutral-700',
    className
  )
  return (
    <div className={boxClasses} {...props}>
      {children}
    </div>
  )
}

export default Box