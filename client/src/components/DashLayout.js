import { Outlet } from 'react-router-dom';
import DashHeader from './DashHeader';
import DashFooter from './DashFooter';

const DasyLayout = () => {
    return (
        <>
            <DashHeader />
            <div classname="dash-container">
                <Outlet />
            </div>
            <DashFooter />
        </>
    )
}
export default DasyLayout