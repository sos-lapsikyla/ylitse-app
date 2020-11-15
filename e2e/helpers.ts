import { by, element, expect, device } from "detox"
import fetch from 'node-fetch'

/**
 * Scrolls view down if needed and taps the given element
 */
export async function scrollDownAndTap(elementId: string, viewId: string) {
    await waitFor(element(by.id(elementId))).toBeVisible().whileElement(by.id(viewId)).scroll(100, 'down')
    await element(by.id(elementId)).tap();
}

/**
 * Waits until input is visible and then types given text
 */
export async function waitAndTypeText(elementId: string, text: string) {
    await waitFor(element(by.id(elementId))).toBeVisible().withTimeout(5000);
    await element(by.id(elementId)).typeText(text);
}

/**
 * Get access_token for admin 
 */
export async function APIAdminAccessToken() {
    const loginResponse = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        body: JSON.stringify({ login_name: 'admin', password: 'secret' }),
    })
    const tokens: any = await loginResponse.json();
    return tokens.tokens.access_token;
}

/**
 * Get users from API 
 */
export async function APIUsers(access_token: string) {
    const headers = {
        'Authorization': `Bearer ${access_token}`
    }
    const usersResponse = await fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: headers
    })
    const users: any = await usersResponse.json();
    return users.resources;
}

/**
 * Makes HTTP API calls to delete all users except those with role 'admin' 
 */
export async function deleteAccountsDB() {
    const access_token = await APIAdminAccessToken();
    const users: any = await APIUsers(access_token);

    const headers = {
        'Authorization': `Bearer ${access_token}`
    }
    for (const user of users) {
        if (user.role == 'admin') {
            continue;
        }
        await fetch(`http://localhost:3000/api/accounts/${user.account_id}`, {
            method: 'DELETE',
            headers: headers
        })
    }
}
