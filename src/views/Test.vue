<template>
    <button @click="notification">알림</button>
</template>

<script>
export default {
    data() {
        return {}
        },
    methods: {
        notification () {
                if (window.Notification) {
                    Notification.requestPermission();
                }
            function pushNotification() {
                setTimeout(function () {
                    notify();
                }, 1000);
            }
            pushNotification();
            function notify() {
                if (Notification.permission !== 'granted') {
                    alert('notification is disabled');
                }
                else {
                    var notification = new Notification('EEEAZY Notification', {
                        icon: 'https://i.imgur.com/wxV4WcW.png',
                        body: '새 글이 등록되었습니다.',
                    });
                    notification.onclick = function () {
                        window.open('http://localhost:8080/portfolio');
                    };
                }
            }
        }
    }
}
</script>

<style>

</style>
