import { Spin } from 'antd'

const pageLoading = () => {
  return (
    <div className="root">
      <Spin />
      <style jsx>
        {`
          .root {
            position: fixed;
            z-index: 100;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(255, 255, 255, 0.5);
          }
        `}
      </style>
    </div>
  )
}

export default pageLoading