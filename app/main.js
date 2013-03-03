define(['lib/core','app/modules/document_toolbar','app/modules/document_viewer'], function ( core, document_toolbar, document_viewer ) {


    core.modules.create({
        'document_toolbar': {
            creator: document_toolbar
        },
        'document_viewer': {
            creator: document_viewer
        }
    });

});
