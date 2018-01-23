<?php

$form =
'<div class="b-feedback">

    <div class="b-leaflet_heading">
        <div class="b-leaflet_heading_title">'.(isset($_GET['header']) ? $_GET['header'] : 'Текст с призывом заполнить форму и стать инвестором сейчас').'</div>
    </div>

    <div class="b-leaflet_wrap">

        <div class="b-form">
            <form action="/php/form.php" method="post" data-checkup="true" data-checkup-on-change="true" data-checkup-on-keyup="true" data-xhr="true">

                <div class="b-form_box placeholder">

                    <label class="b-form_box_title" for="feedback-name">Ваше имя *</label>

                    <div class="b-form_box_field">
                        <input type="text" name="name" autocomplete="off" id="feedback-name" data-required />
                    </div>

                </div>

                <div class="b-form_box placeholder">

                    <label class="b-form_box_title" for="feedback-phone">Телефон *</label>

                    <div class="b-form_box_field">
                        <input type="tel" name="phone" autocomplete="off" id="feedback-phone" data-masking="+7 (999) 999-99-99" data-required data-pattern="^(\+7)\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$" data-pattern-type="phone" />
                    </div>

                </div>

                <div class="b-form_box placeholder">

                    <label class="b-form_box_title" for="feedback-email">E-mail *</label>

                    <div class="b-form_box_field">
                        <input type="text" name="email" autocomplete="off" id="feedback-email" data-required data-pattern="[0-9a-z_.-]+@[0-9a-z\_\-]+\.[a-z]{2,5}" data-pattern-type="email" />
                    </div>

                </div>

                <div class="b-form_bottom">';

$form .= isset($_GET['id']) ? '<input type="hidden" name="id" value="'.$_GET['id'].'" />' : '';
$form .= isset($_GET['header']) ? '<input type="hidden" name="header" value="'.$_GET['header'].'" />' : '';
$form .= isset($_GET['subHeader']) ? '<input type="hidden" name="subHeader" value="'.$_GET['subHeader'].'" />' : '';
$form .= isset($_GET['comment']) ? '<input type="hidden" name="comment" value="'.$_GET['comment'].'" />' : '';

$form .=
                   '<button type="submit" class="e-btn e-btn_md e-btn_blue e-btn_block e-btn_progress">Стать инвестором</button>

                </div>

                <div class="b-form_notice g-center">

                    <p>Нажимая кнопку &laquo;Получить презентацию&raquo;<br />Вы соглашаетесь <a href="#" data-target="_blank">с&nbsp;политикой конфиденциальности фонда</a></p>

                </div>

            </form>
        </div>

    </div>

</div>';

echo $form;

?>