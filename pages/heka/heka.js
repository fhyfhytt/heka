// pages/heka/heka.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasHidden:true,
    imagePath: "",
    name: "",
    maskHidden: true,
    background:"/images/heka.jpg",
    pageBackgroundColor:"#ff4366",
    color:"white"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // var that = this;
    // let base64 = wx.getFileSystemManager().readFileSync(this.data.background, 'base64');
    // that.setData({
    //   'background': 'data:image/jpg;base64,' + base64
    // });
    this.createNewImg();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
    } else {
      return {
        title: '恭喜新年快乐',
        path: "",
        imageUrl:"",
        success: function (res) {
          if (res.errMsg == 'shareAppMessage:ok') {

          }
        }
      }
    }
  }, 
  setName: function (context){
    context.setFontSize(20);
    context.setFillStyle("#67695b");
    context.save();
    // context.translate(170, 506);//必须先将旋转原点平移到文字位置
    console.log(this.data.name)
    if (this.data.name==""){
      context.fillText( "张 三 敬", 150, 460);//必须为（0,0）原点
    }else{
      context.fillText(this.data.name + " 敬", 150, 460);//必须为（0,0）原点
    }
    context.textAlign = 'center';//文本水平对齐方式
    context.textBaseline = 'middle';//文本垂直方向，基线位置 
    context.restore();
    context.stroke();
  },
  createNewImg: function (e) {
    var that = this;
    if(e){
      that.setData({
        name:e.detail.value
      })
    }
    var context = wx.createCanvasContext('share');
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(this.data.background, 0, 0, 375, 580);
    //绘制图片
    that.setName(context)
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'share',
        x: 0,
        y: 0,
        width: 375,
        height: 580,
        destWidth: 750,
        destHeight: 1000,
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          that.setData({
            imagePath: tempFilePath,
            // canvasHidden:true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  saveImageToPhotosAlbum:function(){
    
    let that = this
    that.setData({
      pageBackgroundColor: "white",
      color: "black"
    })
    const ctx = wx.createCanvasContext('share')
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    ctx.drawImage(this.data.background, 0, 0, 375, 580);
    that.setName(ctx)
    ctx.draw(true,function () {
      wx.canvasToTempFilePath({
          x:0,
          y: 0,
          width: 375,
          height: 580,
          destWidth: 750,
          destHeight: 1000,
          canvasId: 'share',
          success: function (saveRes) {
            that.setData({
              imagePath: saveRes.tempFilePath,
              canvasHidden:true
            });
            wx.saveImageToPhotosAlbum({
              filePath: saveRes.tempFilePath,   // 需要保存的图片地址
              success(res) {
                wx.showToast({
                  title: '图片保存中...',
                  icon: 'loading',
                  duration: 1000
                });
                setTimeout(function () {
                  wx.showToast({
                    title: '图片保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                  that.setData({
                    pageBackgroundColor: "#ff4366",
                    color: "white"
                  })
                }, 1000)

              },
              fail: function (res) {
                that.setData({
                  pageBackgroundColor: "#ff4366",
                  color: "white"
                })
                if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg == "saveImageToPhotosAlbum:fail:auth denied" || res.errMsg == "saveImageToPhotosAlbum:fail authorize no response") {
                  wx.showModal({
                    title: '提示',
                    content: '需要授权才可保存图片',
                    showCancel: false,
                    success(res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success(settingdata) {
                            if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                              wx.showToast({
                                title: '获取权限成功，再次点击可保存图片',
                                icon: 'none',
                                duration: 2000
                              })
                            } else {
                              wx.showToast({
                                title: '获取权限失败',
                                icon: 'none',
                                duration: 2000
                              })
                            }
                          },
                          fail() {
                            wx.showToast({
                              title: '获取权限失败',
                              icon: 'none',
                              duration: 2000
                            })
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
    
          }
        })

      }
    
   )

  },
  previewImg:function(){
    var img = this.data.imagePath 
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },

})