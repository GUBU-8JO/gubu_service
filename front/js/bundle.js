document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5000/api/user-subscriptions/me')
        .then(response => response.json())
        .then(data => {
            const listContainer = document.getElementById('subscription-list');
            if (data.length === 0) {
                listContainer.innerHTML = '<p>No subscriptions found.</p>';
                return;
            }

            data.forEach(subscription => {
                const item = document.createElement('div');
                item.className = 'subscription-item';
                item.innerHTML = `
                    <p><strong>Platform:</strong> ${subscription.platformId}</p>
                    <p><strong>Start Date:</strong> ${subscription.startedDate}</p>
                    <p><strong>Payment Method:</strong> ${subscription.paymentMethod}</p>
                    <p><strong>Period:</strong> ${subscription.period}</p>
                    <p><strong>Account ID:</strong> ${subscription.accountId}</p>
                    <p><strong>Password:</strong> ${subscription.accountPw}</p>
                `;
                listContainer.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error fetching subscriptions:', error);
        });
});
