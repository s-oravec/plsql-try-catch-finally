'use strict';

module.exports = {
    db: {
        superUserDbConnectString: process.env.TAPIR_SUPERUSER_CONN || 'TAPIR_SUPERUSER_CONN',
        peteUserDbConnectString:  process.env.TAPIR_TAPIRUSER_CONN || 'TAPIR_TAPIRUSER_CONN'
    },
};
