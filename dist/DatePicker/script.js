$("#basicDate").flatpickr({
    enableTime: true,
    dateFormat: "F, d Y H:i"
});

$("#rangeDate").flatpickr({
    mode: 'range',
    dateFormat: "Y-m-d"
});

$(".resetDate").flatpickr({
    wrap: true,
    weekNumbers: true,
});