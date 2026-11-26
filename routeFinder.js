
const routeFinder = (function () {

    let data;
    let byId;

    function init(config) {
        data = config.data;
        byId = config.byId;
    }

    return {
        init
    };

})();
