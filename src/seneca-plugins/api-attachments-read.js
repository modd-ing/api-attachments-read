'use strict';

const Promise = require( 'bluebird' );
const db = require( '../db' );

module.exports = function () {

  // Promisify the seneca .act() method
  let act = Promise.promisify( this.act, { context: this });

  this.add( 'init:api-attachments-read', function( msg, done ) {

    db.init()
      .then( function() {

        done();

      });

  });

  // Get attachment
  this.add( 'role:api,path:attachments,cmd:get', function( msg, done ) {

    let attachmentId = ( msg.params.id || msg.query.id ),
      userId = msg.query.userId,
      parentId = msg.query.parentId;

    const queryParams = {
        filters: {}
      },
      queryOptions = {};

    if ( attachmentId ) {

      if ( -1 !== attachmentId.indexOf( ',' ) ) {

        attachmentId = attachmentId.split( ',' );

      }

      queryParams.id = attachmentId;

    } else if ( userId ) {

      if ( -1 !== userId.indexOf( ',' ) ) {

        userId = userId.split( ',' );

      }

      queryParams.userId = userId;

    } else if ( parentId ) {

      if ( -1 !== parentId.indexOf( ',' ) ) {

        parentId = parentId.split( ',' );

      }

      queryParams.parentId = parentId;

    }

    // Results limit
    if ( msg.query.limit && ! isNaN( msg.query.limit ) ) {

      queryOptions.limit = parseInt( msg.query.limit, 10 );

    }

    // Results page
    if ( msg.query.page && ! isNaN( msg.query.page ) ) {

      queryOptions.page = parseInt( msg.query.page, 10 );

    }

    act({
        role: 'api',
        path: 'attachments',
        cmd: 'getAttachments',
        args: queryParams,
        options: queryOptions
      })
      .then( ( result ) => {

        done( null, {
          data: result.data
        });

      })
      .catch( ( err ) => {

        done( err, null );

      });

  });

  return {
    name: 'api-attachments-read'
  };

};
