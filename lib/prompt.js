/*
 *
 * Version: 1.2.0
 * Author: jinglan.woo(a)gmail.com
 * Date: 2014.08.07
 *
 * Friendly prompt text input box: 
 * the text input box has focus prompt disappears 
 * and  prompt appears again when it out of focus
 *
 */

(function ($) {
    $.fn.promptInput = function (prompt, fontColor) { 
        var $this = $(this); //当前传入文本框
        prompt = prompt ? prompt : $this.val(); //在输入框中显示的提示语
        fontColor = fontColor ? fontColor : '#ccc'; //提示语的颜色

        var $promptInput = $this.clone(); //克隆传入的文本框，用于展示

        $promptInput.addClass('prompt-input').css('color', fontColor)
            .attr('prompt', prompt).attr('type','text').removeAttr('name').removeAttr('id')
            .val(prompt); //实例化用于展示的文本框

        $promptInput
            .focusin(function () { //获取焦点时去掉提示
                $(this).css('color', '');
                if ($(this).val() == $(this).attr('prompt')) {
                    $(this).val('');
                }
            })
            .focusout(function () { //失去焦点时显示提示
                if ($(this).val().replace(/\s/g, '') == '') {
                    $(this).val($(this).attr('prompt')).css('color', fontColor);
                    $(this).next().val('');
                }
            }).change(function () { //值发生改变时，同时为当前传入文本框赋值
                $(this).next().val($(this).val());
            }); 

        $this.attr('type', 'hidden').val(''); //改变当前传入文本框类型为隐藏域
        $promptInput.insertBefore($this); //同时追加克隆体到页面
    };
})(jQuery);

$(function () {
    $('.prompt-input').each(function (index, element) { //页面加载完成自动检测 .prompt-input 类，加载效果
        $(element).promptInput();
    });
});
