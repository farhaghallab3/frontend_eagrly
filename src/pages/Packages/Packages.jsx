import React from 'react';
import SubscriptionPlans from '../../components/ecommerce/SubscriptionPlans/SubscriptionPlans';
import { Container } from 'react-bootstrap';

const Packages = () => {
    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#0F1A24' }}>
            <Container>
                <h1 className="text-white mb-4">Subscription Packages</h1>
                <SubscriptionPlans />
            </Container>
        </div>
    );
};

export default Packages;
