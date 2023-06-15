const Spinner = ({ caption }: { caption?: string }) => (
  <div className='my-8 grid place-items-center'>
    <div className='spinner' />
    <p className='font-bold'>{caption}</p>
  </div>
)

export default Spinner
